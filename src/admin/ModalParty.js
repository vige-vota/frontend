import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {InputText} from 'primereact/inputtext'
import 'primeflex/primeflex.css'
import './ModalParty.css'
import {PartyUpload} from './PartyUpload'
import {referendum} from '../vote/Party'
import {isParty, isGroup, getParent, generateId} from '../Utilities'
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

    }
	
    open() {
        if (this.props.party.votingPaper.type !== referendum) {
        	this.setState({ 
				configurationHeader: <FormattedMessage
           			id='app.configuration.headerparty'
            		defaultMessage='Configure your Party'
        		/>
        	})
        	
			this.setState({ 
				configurationGroupHeader: <FormattedMessage
            		id='app.configuration.headergroup'
            		defaultMessage='Configure your Group'
        		/>
        	})

			this.setState({ 
        		configurationInsertPartyHeader: <FormattedMessage
            		id='app.configuration.headerinsertparty'
            		defaultMessage='Insert your Party'
        		/>
        	})

			this.setState({ 
        		configurationInsertGroupHeader: <FormattedMessage
            		id='app.configuration.headerinsertgroup'
            		defaultMessage='Insert your Group'
        		/>
        	})
        } else {
			this.setState({ 
        		configurationHeader: <FormattedMessage
           			id='app.configuration.referendum.headerparty'
            		defaultMessage='Configure your Vote'
        		/>
        	})

			this.setState({ 
       	    	configurationGroupHeader: <FormattedMessage
            		id='app.configuration.referendum.headergroup'
            		defaultMessage='Configure your Referendum'
        		/>
        	})

			this.setState({ 
        		configurationInsertPartyHeader: <FormattedMessage
            		id='app.configuration.referendum.headerinsertparty'
            		defaultMessage='Insert your Vote'
        		/>
        	})

			this.setState({ 
        		configurationInsertGroupHeader: <FormattedMessage
            		id='app.configuration.referendum.headerinsertgroup'
            		defaultMessage='Insert your Referendum'
        		/>
        	})
		}
		this.setState({ visible: true })
    }

    confirm() {
		let value = {
			name: this.state.partyName,
			subtitle: this.state.partyTitle,
			image: this.state.image,
			votingPaper: this.props.votingPaper.props.config,
			parties: this.props.party.parties,
			state: this.state.operation
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
			if ((!this.props.party.name && validateGroup(value)) ||
				(this.props.party.name && validateParty(value))) {
				let generatedId = generateId()
				value.id = generatedId
				if (this.props.party.name)
					this.props.party.parties.push(
						value
					)
				else {
					if (!this.props.party.votingPaper.groups) {
						this.props.party.votingPaper.parties.push(
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

	render() {
		let party = this.props.party
		let deleteButton = ''
		if (party && this.state.operation === 'update')
			deleteButton = <FormattedMessage
                    id='app.delete'
                    defaultMessage='Delete'>
                    {(ok) => <Button label={ok[0]} icon='pi pi-check' onClick={this.delete}
					className='confirm' />}
                </FormattedMessage>
        const footer = (
            <div>
                <FormattedMessage
                    id='app.confirm'
                    defaultMessage='Confirm'>
                    {(yes) => <Button label={yes[0]} icon='pi pi-check' onClick={this.confirm}
					className='confirm' />}
                </FormattedMessage>

                {deleteButton}

				<FormattedMessage
                    id='app.cancel'
                    defaultMessage='Cancel'>
                    {(no) => <Button label={no[0]} icon='pi pi-times' onClick={this.onHide}
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
			 else if (this.props.party.name || this.props.party.votingPaper.type === 'little-nogroup')
				header = this.state.configurationInsertPartyHeader
			 else
				header = this.state.configurationInsertGroupHeader
		let autoFocus = false
		if (this.state.operation === 'insert' && !this.state.partyName)
			autoFocus = true
		let inputTextProps = {
			autoFocus: autoFocus
		}
		let inputText = <InputText {...inputTextProps} value={this.state.partyName} onChange={(e) => this.setState(
						{
							partyName: e.target.value
						}) } onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Enter')
								this.confirm()
						}} />
        return (
            <Dialog contentStyle={{'maxHeight': '600px', 'width':'360px'}} header={header} visible={this.state.visible} footer={footer} onHide={this.onHide} className='modal-party'>
				<div className='grid'>
    				<div className='col'>{this.state.name}</div>
    				<div className='col'>{inputText}</div>
				</div>
				<div className='grid'>
    				<div className='col'>{this.state.title}</div>
    				<div className='col'><InputText ref={(input) => { this.title = input; }} value={this.state.partyTitle ? this.state.partyTitle : ''} onChange={(e) => this.setState(
						{
							partyTitle: e.target.value
						})} /></div>
				</div>
				<div className='grid'>
    				<div className='col'>
						<FormattedMessage id='app.configuration.chooseimage'
            					defaultMessage='Choose Image'>
								{(chooseImage) => <PartyUpload accept='image/*' maxFileSize={60000}
													chooseLabel={chooseImage[0]} 
													party={this} previewWidth={150} />}
						</FormattedMessage>
					</div>
				</div>
            </Dialog>)
	}
}