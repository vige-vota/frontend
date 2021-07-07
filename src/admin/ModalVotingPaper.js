import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {colorTabs, removeTab, generateId, addToList} from '../Utilities'
import {InputText} from 'primereact/inputtext'
import {Checkbox} from 'primereact/checkbox'
import {InputNumber} from 'primereact/inputnumber'
import {ColorPicker} from 'primereact/colorpicker'
import {ListBox} from 'primereact/listbox'
import 'primeflex/primeflex.css'
import { validateVotingPaper, validateDisjointed } from './Ruler'
import { config } from '../App'
import './ModalVotingPaper.css'

const types = [
    {label: 'Bigger', value: 'bigger'},
    {label: 'Bigger party groups', value: 'bigger-partygroup'},
    {label: 'Little', value: 'little'},
    {label: 'Little no groups', value: 'little-nogroup'}
];

export class ModalVotingPaper extends Component {

    constructor() {
        super()
        this.state = {
			votingPaper: '',
			app: '',
			operation: '',
			disjointed: false,
			maxCandidates: 0,
			zone: -1,
			color: '',
			type: ''
        }
 		this.zone = React.createRef()
        this.state.configurationHeader = <FormattedMessage
            id='app.configuration.header'
            defaultMessage='Configure your Voting Paper'
        />

        this.state.configurationInsertHeader = <FormattedMessage
            id='app.configuration.insert.header'
            defaultMessage='Add your Voting Paper'
        />

        this.state.name = <FormattedMessage
            id='app.configuration.name'
            defaultMessage='Name'
        />

        this.state.disjointedLabel = <FormattedMessage
            id='app.configuration.disjointed'
            defaultMessage='Disjointed vote'
        />

        this.state.maxCandidatesLabel = <FormattedMessage
            id='app.configuration.maxcandidates'
            defaultMessage='Candidates number'
        />

        this.state.zoneLabel = <FormattedMessage
            id='app.configuration.zone'
            defaultMessage='Zone'
        />

        this.state.templatesLabel = <FormattedMessage
            id='app.configuration.templateslabel'
            defaultMessage='Template Type'
        />

        this.state.colorLabel = <FormattedMessage
            id='app.configuration.color'
            defaultMessage='Voting Paper color'
        />
		
        this.open = this.open.bind(this)
        this.confirm = this.confirm.bind(this)
        this.delete = this.delete.bind(this)
        this.onHide = this.onHide.bind(this)

    }

	componentDidUpdate() {
		if (this.state.app && this.state.operation.startsWith('confirmed')) {
  			let tabs = colorTabs(this.state.app)
			this.setState({ operation: '' })
			if (this.state.operation === 'confirmed_insert')
				tabs[tabs.length-3].click()
			else if (this.state.operation === 'confirmed_update' && this.state.app.state.activeItem.id === this.state.votingPaper.value.id) {
				let index = 0
				tabs.forEach((e, i) => {
					if (e.className.indexOf('-' + this.state.app.state.activeItem.id) >= 0)
						index = i
				})
				tabs[index].click()
			}
		}
	}
	
    open() {
        this.setState({ visible: true })
    }

    confirm() {
		if (validateVotingPaper(this.state, config.votingPapers)) {
			if (this.state.operation === 'update') {
				config.votingPapers.forEach((votingPaper) => {
					if (votingPaper.id === this.state.votingPaper.value.id) {
						votingPaper.name = this.state.votingPaper.value.label
						votingPaper.disjointed = this.state.disjointed
						votingPaper.maxCandidates = this.state.maxCandidates
						if (this.state.type === 'little-nogroup' || this.state.type === 'little')
							votingPaper.zone = -1
						else
							votingPaper.zone = this.state.zone
						votingPaper.color = this.state.color
						votingPaper.type = this.state.type
					}
				})
				this.state.app.state.items.forEach((item) => {
					if (item.id === this.state.votingPaper.value.id) {
						item.label = this.state.votingPaper.value.label
					}
				})
				this.setState({ visible: false, operation: 'confirmed_update' })
			} else {
				let generatedId = generateId()
				let groupsAr
				let partiesAr
				let zoneForPapers = this.state.zone
				if (this.state.type === 'little-nogroup') {
					partiesAr = []
				} else {
					groupsAr = []
				}
				if (this.state.type === 'little-nogroup' || this.state.type === 'little')
					zoneForPapers = -1
				config.votingPapers.push(
					{ id: generatedId, 
					  name: this.state.votingPaper.value.label, 
					  groups: groupsAr,
					  parties: partiesAr,
					  disjointed: this.state.disjointed,
					  maxCandidates: this.state.maxCandidates,
					  zone: zoneForPapers,
					  color: this.state.color, 
					  type: this.state.type
					})
				const length = this.state.app.state.items.length-2
				this.state.app.setState({ items: addToList({ id: generatedId, label: this.state.votingPaper.value.label, icon: 'pi pi-fw pi-briefcase' }, length, this.state.app.state.items) })
        		this.setState({ visible: false, operation: 'confirmed_insert' })
			}
			this.state.app.forceUpdate()
		}
    }

    delete() {
		removeTab(this.state.votingPaper.value, this.state.app)
        this.setState({ visible: false, operation: 'confirmed_delete' })
    }

    onHide() {
        this.setState({ visible: false })
    }

    imgTemplate(option) {
		const logoPath = './template_images/' + option.value + '.png';

        return (
            <div className='p-clearfix'>
                <img alt={option.label} src={logoPath} style={{display:'inline-block',margin:'5px 0 0 5px',width:48}} />
                <span style={{fontSize:'1em',float:'right',margin:'1em .5em 0 0'}}>{option.label}</span>
            </div>
        )
    }

	render() {
		let votingPaperValue = this.state.votingPaper.value
		let deleteButton = ''
		let zoneClass = 'p-grid'
		if (votingPaperValue && this.state.operation === 'update')
			deleteButton = <FormattedMessage
                    id='app.delete'
                    defaultMessage='Delete'>
                    {(ok) => <Button label={ok[0]} icon='pi pi-check' onClick={this.delete} className='confirm' />}
                </FormattedMessage>
		if (this.state.type === 'little-nogroup' || this.state.type === 'little')
			zoneClass = 'p-grid disabled'
		const zoneField = (
				<div className={zoneClass} ref={this.zone}>
    				<div className='p-col'>{this.state.zoneLabel}</div>
    				<div className='p-col'><InputNumber showButtons onValueChange={(e) => this.setState(
						{
							zone: Number.isInteger(e.value) ? parseInt(e.value, 10) : 0
						}) } value={this.state.zone} min={-1}></InputNumber></div>
				</div>
		)
        const footer = (
            <div>
                <FormattedMessage
                    id='app.confirm'
                    defaultMessage='Confirm'>
                    {(yes) => <Button label={yes[0]} icon='pi pi-check' onClick={this.confirm} className='confirm' />}
                </FormattedMessage>

                {deleteButton}

				<FormattedMessage
                    id='app.cancel'
                    defaultMessage='Cancel'>
                    {(no) => <Button label={no[0]} icon='pi pi-times' onClick={this.onHide} className='p-button-secondary confirm' />}
                </FormattedMessage>
            </div>
        )
		let header = this.state.configurationInsertHeader
		if (this.state.operation === 'update')
			header = this.state.configurationHeader
		let autoFocus = false
		if (this.state.operation === 'insert' && !this.state.votingPaper.value)
			autoFocus = true
		let inputTextProps = {
			autoFocus: autoFocus
		}
		let inputText = <InputText {...inputTextProps} value={votingPaperValue ? votingPaperValue.label : ''} onChange={(e) => this.setState(
						{
							votingPaper: { 
								value: { 
									label: e.target.value,
									id: votingPaperValue ? votingPaperValue.id : '',
									icon: 'pi pi-fw pi-briefcase'
								}
							}
						}) } onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Enter')
								this.confirm()
						}} />
        return (
            <Dialog contentStyle={{'maxHeight': '600px', 'width':'360px'}} header={header} visible={this.state.visible} footer={footer} onHide={this.onHide} className='modal-voting-paper'>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.name}</div>
    				<div className='p-col'>{inputText}</div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.disjointedLabel}</div>
    				<div className='p-col'><Checkbox onChange={(e) => { 
						if (validateDisjointed(votingPaperValue)) this.setState(
						{
							disjointed: e.checked
						}) }} checked={this.state.disjointed}></Checkbox></div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.maxCandidatesLabel}</div>
    				<div className='p-col'><InputNumber showButtons onValueChange={(e) => this.setState(
						{
							maxCandidates: Number.isInteger(e.value) ? parseInt(e.value, 10) : 0
						}) } value={this.state.maxCandidates} min={0} max={3}></InputNumber></div>
				</div>
				{ zoneField }
				<div className='p-grid'>
    				<div className='p-col'>{this.state.colorLabel}</div>
    				<div className='p-col'><ColorPicker value={this.state.color} 
						onChange={(e) => this.setState({color: e.value})} />
					</div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.templatesLabel}</div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>
							<ListBox value={this.state.type} filter={true} options={types} onChange={(e) => {
								if (e.value) {
									this.setState({type: e.value})
									if (e.value === 'little-nogroup' || e.value === 'little')
										this.zone.current.className = 'p-grid disabled'
									else
										this.zone.current.className = 'p-grid'
								}
							}} itemTemplate={this.imgTemplate} 
                                    style={{width: '20.5em'}} listStyle={{maxHeight: '250px'}} />
					</div>
				</div>
            </Dialog>)
	}
}