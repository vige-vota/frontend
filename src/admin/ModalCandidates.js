import React, { Component, createRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {RadioButton} from 'primereact/radiobutton'
import {InputText} from 'primereact/inputtext'
import {ListBox} from 'primereact/listbox'
import 'primeflex/primeflex.css'
import './ModalCandidates.css'
import {CandidateUpload} from './CandidateUpload'
import {generateId, hasIdInTheTree, getValueById} from '../Utilities'
import {M, F} from '../vote/Validator'
import { validateCandidate } from './Ruler'
import { config } from '../App'
import UserService from '../services/UserService'
		
export class ModalCandidates extends Component {
        
    constructor(data) {
        super(data)
        this.state = {
			id: '',
			name: '',
			sex: '',
			image: '',
			candidate: {},
			candidates: [],
			generateId: '',
			opened: false
        }
		this.candidateUpload = createRef()
 		this.candidatesDialog = createRef()
 		this.boxCandidates = createRef()
 		this.nameInputText = createRef()
        this.state.configurationHeader = <FormattedMessage
            id='app.configuration.headercandidates'
            defaultMessage='Manage candidates'
        />

        this.state.namesurnameLabel = <FormattedMessage
            id='app.configuration.namesurname'
            defaultMessage='Name and surname'
        />

        this.state.genderLabel = <FormattedMessage
            id='app.configuration.gender'
            defaultMessage='Gender'
        />

        this.state.chooseImage = <FormattedMessage
            id='app.configuration.chooseimage'
            defaultMessage='Choose Image'
        />
		
        this.open = this.open.bind(this)
        this.confirm = this.confirm.bind(this)
        this.onHide = this.onHide.bind(this)
		this.imgTemplate = this.imgTemplate.bind(this);

    }
	
    open() {
		let party = this.props.party
		let candidates = []
		if (party.candidates)
			party.candidates.forEach(e => { 
				candidates.push( {
					label: e.name,
					value: e.id,
					id: e.id,
					name: e.name,
					image: e.image,
					sex: e.sex
				})
			})
		let isAdmin = UserService.getRoles().includes('admin')
		let block = parseInt(config.profile.attributes['block'][0], 10)
		let partyEnabled = isAdmin || hasIdInTheTree(getValueById(party.id), block)
		this.setState({ id: '', sex: '', image: '', name: '', candidates: candidates, visible: true, partyEnabled: partyEnabled, isAdmin: isAdmin, block: block })
    }

    confirm() {
		this.props.party.candidates = this.state.candidates
		this.props.partyComponent.forceUpdate()
		this.setState({ visible: false })
    }

    onHide() {
        this.setState({ visible: false })
    }

    imgTemplate(option) {
		let candidate = this.state.candidates.filter(e => e.id === parseInt(option.value, 10))[0]
				
		const image = candidate.image;
		
        return (
            <div className='p-clearfix'>
				<img alt={option.label} src={`data:image/jpeg;base64,${image}`} style={{display:'inline-block',margin:'5px 0 0 5px',width:48}} />
                <span style={{fontSize:'1.3em',float:'right',margin:'1em .5em 0 0'}}>{option.label}</span>
            </div>
        )
	}

	render() {
		let selectedCandidate = this.state.candidates.filter(e => e.id === this.state.id)[0]
        const footer = (
            <div>
                <FormattedMessage
                    id='app.confirm'
                    defaultMessage='Confirm'>
                    {(yes) => <Button label={yes[0]} icon='pi pi-check' onClick={this.confirm}
					className='confirm' />}
                </FormattedMessage>

				<FormattedMessage
                    id='app.cancel'
                    defaultMessage='Cancel'>
                    {(no) => <Button label={no[0]} icon='pi pi-times' onClick={this.onHide}
					className='p-button-secondary confirm' />}
                </FormattedMessage>
            </div>
        )
		let isIdInTheTree = this.state.isAdmin || hasIdInTheTree(getValueById(this.state.id), this.state.block)
        let candidateUpload = <div className='grid'>
    				<div className='col'>
    					<FormattedMessage id='app.configuration.chooseimage'
            				defaultMessage='Choose Image'>
							{(chooseImage) => <CandidateUpload ref={this.candidateUpload} accept='image/*' maxFileSize={60000}
													chooseLabel={chooseImage[0]} 
													party={this} candidate={selectedCandidate} 
													previewWidth={150} disabled={!isIdInTheTree} />}
		   				</FormattedMessage>
					</div>
				</div>
        return (
            <Dialog ref={this.candidatesDialog} contentStyle={{'maxHeight': '700px', 'width':'360px'}} header={this.state.configurationHeader} visible={this.state.visible} footer={footer} onHide={this.onHide} className='modal-candidates'>
				<div className='grid'>
    				<div className='col'>{this.state.namesurnameLabel}</div>
    				<div className='col'><InputText ref={this.nameInputText} 
						 value={this.state.name} disabled={!isIdInTheTree}
						 onChange={(e) => {
							this.setState({ name: e.target.value})
						 }} /></div>
				</div>
				<div className='grid'>
    				<div className='col'>{this.state.genderLabel}</div>
    				<div className='col'>
						{M}
						<RadioButton value={M} name='sex' 
							onChange={(e) => this.setState({ sex: e.value })} 
							checked={this.state.sex === M} disabled={!isIdInTheTree} />
						{F}
						<RadioButton value={F} name='sex' 
							onChange={(e) => this.setState({ sex: e.value })} 
							checked={this.state.sex === F} disabled={!isIdInTheTree} />
					</div>
				</div>
				{candidateUpload}
				<hr style={{ background: '#fff' }} />
				<div className='grid'>
    				<div className='col admin-candidates'>
    					<FormattedMessage
                    		id='app.insert'
                    		defaultMessage='Insert'>
                    		{(yes) => <Button disabled={!this.state.partyEnabled} label={yes[0]} icon='pi pi-check' onClick={() => {
								let value = {
									name: this.state.name,
									sex: this.state.sex,
									image: this.state.image,
									label: this.state.name
								}
								if (validateCandidate(value, this.state.candidates)) {
									let generatedId = this.state.generateId
									if (!generatedId)
										generatedId = generateId()
									this.setState({
										generateId: generatedId + 1
									})
									value.id = generatedId
									value.value = generatedId
									this.state.candidates.push(value)}
								}
							}
							className='confirm' />}
                		</FormattedMessage>
                		<FormattedMessage
                    		id='app.update'
                    		defaultMessage='Update'>
                    		{(yes) => <Button disabled={!isIdInTheTree} label={yes[0]} icon='pi pi-check' onClick={() => {
								let value = {
									id: this.state.id,
									name: this.state.name,
									sex: this.state.sex,
									image: this.state.image,
									label: this.state.name
								}
								if (validateCandidate(value, this.state.candidates)) {	
									this.state.candidates.forEach((f) => {
										if (f.value === this.state.id) {
											f.label = this.state.name
											f.id = this.state.id
											f.name = this.state.name
											f.image = this.state.image
											f.sex = this.state.sex
										}
									})}
								}
							}
							className='confirm' />}
                		</FormattedMessage>
                		<FormattedMessage
                    		id='app.delete'
                    		defaultMessage='Delete'>
                    		{(yes) => <Button disabled={!this.state.partyEnabled} label={yes[0]} icon='pi pi-check' onClick={() => {
								const index = this.state.candidates.map((e) => e.id).indexOf(this.state.id)
								this.state.candidates.splice(index, 1)
								this.setState({
									id: '',
									name: '',
									image: '',
									sex: ''
								})
								this.candidateUpload.current.onRemove({})
								}
							}
							className='confirm' />}
                		</FormattedMessage>
					</div>
				</div>
				<div className='grid'>
					<div className='col'>
							<ListBox ref={this.boxCandidates} value={this.state.id} filter={true} options={this.state.candidates} onChange={(e) => {
								let selectedCandidate = this.state.candidates.filter(f => f.id === parseInt(e.value, 10))[0]
								if (e.value) {
									this.setState({id: e.value, 
												   name: selectedCandidate.name, 
												   sex: selectedCandidate.sex ,
												   image: selectedCandidate.image,
												   opened: true})
								} else {
									this.setState({id: '', name: '', sex: '', image: '', opened: true})
								}
							}} itemTemplate={this.imgTemplate} style={{width: '21em'}} listStyle={{maxHeight: '250px'}} />
					</div>
				</div>
            </Dialog>)
	}
}