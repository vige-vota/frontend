import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import 'primeflex/primeflex.css'
import './ModalParty.css'
import {PartyUpload} from './PartyUpload'
import {addImage, isParty, isGroup, getParent, generateId} from '../Utilities'
import { validateParty, validateGroup } from './Ruler'

export class ModalParty extends Component {

    constructor() {
        super()
        this.state = {
			partyName: '',
			partyTitle: '',
			image: '',
			operation: '',
			opened: false
        }
        this.state.configurationHeader = <FormattedMessage
            id='app.configuration.headerparty'
            defaultMessage='Configure your Party'
        />

        this.state.configurationGroupHeader = <FormattedMessage
            id='app.configuration.headergroup'
            defaultMessage='Configure your Group'
        />

        this.state.configurationInsertGroupHeader = <FormattedMessage
            id='app.configuration.headerinsertgroup'
            defaultMessage='Insert your Party'
        />

        this.state.configurationInsertVotingPaperHeader = <FormattedMessage
            id='app.configuration.headerinsertvotingpaper'
            defaultMessage='Insert your Group'
        />

        this.state.name = <FormattedMessage
            id='app.configuration.name'
            defaultMessage='Name'
        />

        this.state.title = <FormattedMessage
            id='app.configuration.title'
            defaultMessage='Title'
        />

        this.state.chooseImage = <FormattedMessage
            id='app.configuration.chooseimage'
            defaultMessage='Choose Image'
        />
		
        this.open = this.open.bind(this)
        this.confirm = this.confirm.bind(this)
        this.delete = this.delete.bind(this)
        this.onHide = this.onHide.bind(this)
		this.onSelect = this.onSelect.bind(this);

    }

	componentDidUpdate() {
		if (this.state.operation === 'insert' && !this.state.partyName)
			this.name.element.focus()
	}
	
    open() {
		this.setState({ visible: true })
    }

    confirm() {
		let value = {
			name: this.state.partyName,
			subtitle: this.state.partyTitle,
			image: this.state.image
		}
		if (this.state.operation === 'update') {
			if ((isParty(this.props.party) && validateParty(value)) ||
				(isGroup(this.props.party) && validateGroup(value))) {
				this.props.party.name = value.name
				this.props.party.subtitle = value.subtitle
				this.props.party.image = value.image
				this.setState({ visible: false })
				this.props.votingPaper.forceUpdate()
			}
		} else {
			if (validateParty(value)) {
				let generatedId = generateId()
				value.id = generatedId
				if (this.props.party.name)
					this.props.party.parties.push(
						value
					)
				else {
					if (this.props.party.votingPaper.type === 'little-nogroup') {
						if (this.props.party.votingPaper.groups.length === 0) {
							this.props.party.votingPaper.groups = []
							this.props.party.votingPaper.groups.push({
								id: generateId(),
								parties: []
							})
						}
						this.props.party.votingPaper.groups[0].parties.push(
							value
						)
					} else {
						value.parties = []
						this.props.party.votingPaper.groups.push(
							value
						)
					}
				}
				this.setState({ visible: false })
				this.props.votingPaper.forceUpdate()
			}
		}
    }

    delete() {
		let parent = getParent(this.props.party)
		if (isParty(this.props.party)) {
			let index = parent.parties.map((e) => e.id).indexOf(this.props.party.id)
			parent.parties.splice(index, 1)
		} else {
			let index = parent.groups.map((e) => e.id).indexOf(this.props.party.id)
			parent.groups.splice(index, 1)
		}
        this.setState({ visible: false })
		this.props.votingPaper.forceUpdate()
    }

    onHide() {
        this.setState({ visible: false })
    }

    onSelect(event) {
		if (event.files[0].objectURL)
        	addImage(event.files[0].objectURL, this)
    }

	render() {
		let party = this.props.party
		let deleteButton = ''
		if (party && this.state.operation === 'update')
			deleteButton = <FormattedMessage
                    id='app.delete'
                    defaultMessage='Delete'>
                    {(ok) => <Button label={ok} icon='pi pi-check' onClick={this.delete}
					className='confirm' />}
                </FormattedMessage>
        const footer = (
            <div>
                <FormattedMessage
                    id='app.confirm'
                    defaultMessage='Confirm'>
                    {(yes) => <Button label={yes} icon='pi pi-check' onClick={this.confirm}
					className='confirm' />}
                </FormattedMessage>

                {deleteButton}

				<FormattedMessage
                    id='app.cancel'
                    defaultMessage='Cancel'>
                    {(no) => <Button label={no} icon='pi pi-times' onClick={this.onHide}
					className='p-button-secondary confirm' />}
                </FormattedMessage>
            </div>
        )
		let header = ''
		if (isParty(this.props.party)) 
			if (this.state.operation === 'update')
				header = this.state.configurationHeader
			else
				header = this.state.configurationInsertHeader
		else if (this.state.operation === 'update')
				header = this.state.configurationGroupHeader
			 else if (this.props.party.name)
				header = this.state.configurationInsertGroupHeader
			 else
				header = this.state.configurationInsertVotingPaperHeader
        return (
            <Dialog contentStyle={{'maxHeight': '600px', 'width':'360px'}} header={header} visible={this.state.visible} footer={footer} onHide={this.onHide} className='modal-party'>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.name}</div>
    				<div className='p-col'><InputText ref={(input) => { this.name = input; }} value={this.state.partyName} onChange={(e) => this.setState(
						{
							partyName: e.target.value
						}) } onKeyPress={(e) => {
							if (e.nativeEvent.keyCode === 13)
								this.confirm()
						}} /></div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>{this.state.title}</div>
    				<div className='p-col'><InputText ref={(input) => { this.title = input; }} value={this.state.partyTitle ? this.state.partyTitle : ''} onChange={(e) => this.setState(
						{
							partyTitle: e.target.value
						})} /></div>
				</div>
				<div className='p-grid'>
    				<div className='p-col'>
						<FormattedMessage id='app.configuration.chooseimage'
            					defaultMessage='Choose Image'>
								{(chooseImage) => <PartyUpload accept='image/*' maxFileSize={1000000} 
													onSelect={this.onSelect}
													chooseLabel={chooseImage} 
													party={this} previewWidth={150} />}
						</FormattedMessage>
					</div>
				</div>
            </Dialog>)
	}
}