import React, { Component } from 'react'
import { Button } from 'primereact/button'
import './AdminButtons.css'
import { config } from '../App'
import { ModalParty } from './ModalParty'
import { ModalCandidates } from './ModalCandidates'
import { isGroup, hasIdInTheTree, hasIdUnderTheTree } from '../Utilities'
import UserService from '../services/UserService'

export class AdminButtons extends Component {

    constructor(data) {
        super(data)
        this.state = {
        }
 		this.modalInsertParty = React.createRef()
 		this.modalParty = React.createRef()
 		this.modalCandidates = React.createRef()
    }

    render() {
		if (config.state === 'PREPARE') {
			const style = {
				color: '#'+this.props.party.votingPaper.color
			}
			let modalInsertButton = ''
			let modalUpdateButton = ''
			let modalCandidatesButton = ''
			let isAdmin = UserService.getRoles().includes('admin')
			let block = parseInt(config.profile.attributes['block'][0], 10)
			let isIdInTheTree = isAdmin || hasIdInTheTree(this.props.party, block)
			let isIdUnderTheTree = isAdmin || hasIdUnderTheTree(this.props.party, block)
			const thisIsGroup = isGroup(this.props.party)
			if (isIdInTheTree) {
				if (thisIsGroup || !this.props.party.name) {
					let styleButton = ''
					if (!this.props.party.name)
						styleButton = ' voting-paper-admin'
					modalInsertButton = <Button icon={'pi pi-plus'} className={'admin-button'+ styleButton} style={style} onClick={(e) => {
								e.stopPropagation()
								this.modalInsertParty.current.setState({
										partyName: '', 
										partyTitle: '', 
										image: '',
										operation: 'insert',
										opened: true
									})
                    			this.modalInsertParty.current.open()
							}
                    	}/>
				}
				if (this.props.party.name) {
            			modalUpdateButton = <Button icon='pi pi-briefcase' className='admin-button' style={style} onClick={(e) => {
								e.stopPropagation()
								this.modalParty.current.setState({
										partyName: this.props.party.name, 
										partyTitle: this.props.party.subtitle, 
										image: this.props.party.image,
										operation: 'update',
										opened: true
									})
                    			this.modalParty.current.open()
							}
                    	}/>
				}
			}
			if ((isIdInTheTree || isIdUnderTheTree) && this.props.party.name && !thisIsGroup && this.props.party.votingPaper.maxCandidates 
							&& this.props.party.votingPaper.maxCandidates > 0)
            			modalCandidatesButton = <Button icon='pi pi-users' className='admin-button' style={style} onClick={(e) => {
								e.stopPropagation()
								this.modalCandidates.current.setState({
										operation: 'update',
										opened: true
									})
                    			this.modalCandidates.current.open()
							}
                    	}/>
        	return (
				<div className='admin-buttons'>
					<ModalParty ref={this.modalParty} party={this.props.party} votingPaper={this.props.votingPaper} />
					<ModalParty ref={this.modalInsertParty} party={this.props.party} votingPaper={this.props.votingPaper} />
					<ModalCandidates ref={this.modalCandidates} partyComponent={this.props.partyComponent} party={this.props.party} votingPaper={this.props.votingPaper} />
					{modalUpdateButton}
					{modalInsertButton}
					{modalCandidatesButton}
				</div>
			)
    	} else return ''
	}
}