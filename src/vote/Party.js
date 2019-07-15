import React from 'react'
import { Button } from 'primereact/button'
import { Candidates } from './Candidates'
import { isGroup, getVotingPaper, add, remove } from '../Utilities'
import classNames from 'classnames'
import { validate, selections } from './Validator'
import { AdminButtons } from '../admin/AdminButtons'
import x from '../images/x.png'
import './Party.css'

export const group = 'group'
export const party = 'party'

export class Party extends Button {

    putX(e) {
		if ((!this.refs['admin-buttons'].refs.modalParty && 
			 !this.refs['admin-buttons'].refs.modalInsertParty && 
			 !this.refs['admin-buttons'].refs.modalCandidates) || 
			(!this.refs['admin-buttons'].refs.modalParty.state.visible && 
			 !this.refs['admin-buttons'].refs.modalInsertParty.state.visible && 
			 !this.refs['admin-buttons'].refs.modalCandidates.state.visible)) {
        	e.value = this.props.party
        	if(!e.target.classList.contains('excludeSelect') && validate(e)){
            	if (!e.value.selected)
                	add(e.value, selections)
            	else
                	remove(e.value, selections)
            	let altLabel = this.props.party.name
            	if (this.props.party.subtitle)
                	altLabel = altLabel+' '+this.props.party.subtitle
            	if (!this.selectedItem) {
                	this.selectedItem = <img className='button-selected' alt={altLabel} src={x} />
                	e.value.selected = true
            	} else {
                	this.selectedItem = null
                	e.value.selected = false
            	}
            	this.forceUpdate()
         	}
		}
    }

    renderIcon() {
        if (this.props.icon) {
            let className = classNames(this.props.icon, 'p-c', {
                'p-button-icon-left': this.props.iconPos !== 'right',
                'p-button-icon-right': this.props.iconPos === 'right'
            })

            let altLabel = this.props.party.name
            if (this.props.party.subtitle)
                altLabel = altLabel+' '+this.props.party.subtitle
            return (
                <span className={className}>
                    {this.props.party.image && <img alt={altLabel} src={`data:image/jpeg;base64,${this.props.party.image}`} />}
                    {this.selectedItem}
                </span>
            )
        }
        else {
            return this.selectedItem
        }
    }

    renderLabel() {
        if (this.props.party.name && !this.props.party.candidates) {
            const buttonLabel = this.props.party.name || 'p-btn'
            let buttonSublabel = ''
            if (this.props.party.subtitle !== 'undefined')
                buttonSublabel = this.props.party.subtitle
            return (<span className='p-button-text p-c'>{buttonLabel}
                        <span className='p-button-subtext p-c'>{buttonSublabel}</span>
                    </span>
            )
        }
    }

    renderCandidates() {
        if (this.props.party.candidates)
            return (<Candidates config={this.props.party.candidates} maxcandidates={getVotingPaper(this.props.party).maxCandidates} />)
    }

    render() {
        this.props.party.type = isGroup(this.props.party) ? group : party
        this.props.party.votingPaper = getVotingPaper(this.props.party)
        let className = classNames('p-button p-component', this.props.className, {
            'p-button-icon-only': this.props.icon && !this.props.party.name && !this.props.party.candidates,
            'p-button-text-icon-left': this.props.icon && (this.props.party.name || this.props.party.candidates) && this.props.iconPos === 'left',
            'p-button-text-icon-right': this.props.icon && (this.props.party.name || this.props.party.candidates) && this.props.iconPos === 'right',
            'p-button-text-only': !this.props.icon && (this.props.party.name || this.props.party.candidates),
            'p-disabled': this.props.disabled
        })
        let icon = this.renderIcon()
        let label = this.renderLabel()
        let candidates = this.renderCandidates()

        let buttonProps = Object.assign({}, this.props)
        delete buttonProps.iconPos
        delete buttonProps.icon
        delete buttonProps.tooltip
        delete buttonProps.tooltipOptions
        delete buttonProps.party
        delete buttonProps.votingPaper

        return (
            <div ref={(el) => this.element = el} {...buttonProps} className={className}>
				<AdminButtons party={this.props.party} partyComponent={this} votingPaper={this.props.votingPaper} ref='admin-buttons'/>
				{this.props.iconPos === 'left' && icon}
                {label}
                {candidates}
                {this.props.iconPos === 'right' && icon}
                {this.props.children}
            </div>
        )
    }
}
