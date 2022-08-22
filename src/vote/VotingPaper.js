import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Party, referendum } from './Party'
import { config } from '../App'
import 'primereact/resources/themes/nova/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './VotingPaper.css'
import { AdminButtons } from '../admin/AdminButtons'

export const votingPaper = 'votingPaper'

export class VotingPaper extends Component {

    constructor(data) {
        super(data)
        this.jsonData = data
    }
    
    renderTitle() {
		let title = ''
		if (this.jsonData.config.type === referendum)
			title = <div className='referendum-title'><FormattedMessage
            			id='app.configuration.referendum'
            			defaultMessage='POPULAR REFERENDUM'
        			/></div>
		return title
	}

    renderPartiesByGroup(group) {
        return group.parties.map((party) => {
        	return this.renderParty(group, party)
        })
    }

    renderParties(parties) {
    	if (parties)
    		return parties.map((party) => {
    			return this.renderParty({ id: 0 }, party)
    		})
    }
    
    renderParty(group, party) {
        let buttonProps = Object.assign({})
        buttonProps.key = 'party-' + group.id + '-' + party.id
        buttonProps.icon = 'pi'
        buttonProps.className = 'p-button-secondary second-row'
        buttonProps.party = party
        buttonProps.ref = buttonProps.key
        buttonProps.id = buttonProps.key
		buttonProps.votingpaper = this
        return (
            <Party {...buttonProps} onClick={(e) => {
                let button = this.refs[buttonProps.ref]
                button.putX(e)
            }}>
            </Party>
        )
    }

    renderGroup(group) {
        if (group.name) {
            let gridRow = { 'gridRow': '1 / ' + (group.parties.length + 1) }
            let isAGrid = ''
            if (group.parties.length > 1)
                isAGrid = 'is-grid'
            let icon
            if (group.image)
                icon = 'pi'
            let buttonProps = Object.assign({})
            buttonProps.key = 'group-' + group.id
            buttonProps.icon = icon
            buttonProps.party = group
            buttonProps.className = 'p-button-secondary first-row ' + isAGrid
            buttonProps.style = gridRow
            buttonProps.ref = buttonProps.key
            buttonProps.id = buttonProps.key
			buttonProps.votingpaper = this
            if (this.jsonData.config.type === referendum) {
				if (config.state !== 'PREPARE')
            		buttonProps.disabled = true
            	return (
                	<Party {...buttonProps} />
            	)
            } else
            	return (
                	<Party {...buttonProps} onClick={(e) => {
                    	let button = this.refs[buttonProps.ref]
                    	button.putX(e)
                	}}>
                	</Party>
            	)
        }
    }

    render() {
        if (this.props.visible) {
			let title = this.renderTitle()
        	if (this.jsonData.config.groups)
        		return (
        			<div className='page'>
        				{title}
        				{this.jsonData.config.groups.map((group, j) => {
        					let party, candidate;
        					party = this.renderPartiesByGroup(group)
        					candidate = this.renderGroup(group)
        					return <div key={'parties-' + j} className={'content-party resize-'+(j%2)}>
                        			  {candidate}
                        			  {party}
                        		   </div>
        				})}
        				<AdminButtons party={{ votingPaper: this.props.config}} votingPaper={this} ref='vt-admin-buttons' />
        			</div>
        		)
        		else return (
        			<div className='page'>
        			     <div key={'parties-0'} className={'content-party resize-0'}>
                        	{this.renderParties(this.jsonData.config.parties)}
                         </div>
                         <AdminButtons party={{ votingPaper: this.props.config}} votingPaper={this} ref='vt-admin-buttons' />
        			</div>
        		)
        } else return (
                <div className='page'>
                </div>
            )
    }
}