import React, { Component } from 'react'
import { Button } from 'primereact/button'
import './AdminButtons.css'
import { config } from '../App'
import { ModalParty } from './ModalParty'
import { ModalCandidates } from './ModalCandidates'
import { isGroup, hasIdInTheTree } from '../Utilities'
import UserService from '../services/UserService'

export class AdminButtons extends Component {

    constructor(data) {
        super(data)
        this.state = {
        }
    }

    render() {
		if (config.state === 'PREPARE') {
			const style = {
				color: '#'+this.props.party.votingPaper.color
			}
			let modalInsertButton = ''
			let modalUpdateButton = ''
			let modalCandidatesButton = ''
			if (UserService.getRoles().includes('admin') || hasIdInTheTree(this.props.party, parseInt(config.profile.attributes['block'][0]))) {
				const thisIsGroup = isGroup(this.props.party)
				if (thisIsGroup || !this.props.party.name) {
					let styleButton = ''
					if (!this.props.party.name)
						styleButton = ' voting-paper-admin'
					modalInsertButton = <Button icon={'pi pi-plus'} className={'admin-button'+ styleButton} style={style} onClick={(e) => {
								e.stopPropagation()
								this.refs.modalInsertParty.setState({
										partyName: '', 
										partyTitle: '', 
										image: '',
										operation: 'insert',
										opened: true
									})
                    			this.refs.modalInsertParty.open()
							}
                    	}/>
				}
				if (this.props.party.name) {
            			modalUpdateButton = <Button icon='pi pi-briefcase' className='admin-button' style={style} onClick={(e) => {
								e.stopPropagation()
								this.refs.modalParty.setState({
										partyName: this.props.party.name, 
										partyTitle: this.props.party.subtitle, 
										image: this.props.party.image,
										operation: 'update',
										opened: true
									})
                    			this.refs.modalParty.open()
							}
                    	}/>
						if (!thisIsGroup && this.props.party.votingPaper.maxCandidates 
							&& this.props.party.votingPaper.maxCandidates > 0)
            				modalCandidatesButton = <Button icon='pi pi-users' className='admin-button' style={style} onClick={(e) => {
									e.stopPropagation()
									this.refs.modalCandidates.setState({
											operation: 'update',
											opened: true
										})
                    				this.refs.modalCandidates.open()
								}
                    		}/>
				}
			}
        	return (
				<div className='admin-buttons'>
					<ModalParty ref='modalParty' party={this.props.party} votingPaper={this.props.votingPaper} />
					<ModalParty ref='modalInsertParty' party={this.props.party} votingPaper={this.props.votingPaper} />
					<ModalCandidates ref='modalCandidates' partyComponent={this.props.partyComponent} party={this.props.party} votingPaper={this.props.votingPaper} />
					{modalUpdateButton}
					{modalInsertButton}
					{modalCandidatesButton}
				</div>
			)
    	} else return ''
	}
}