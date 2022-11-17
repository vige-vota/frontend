import React from 'react'
import { Button } from 'primereact/button'
import { Candidates } from './Candidates'
import { isGroup, getVotingPaper, add, remove } from '../Utilities'
import classNames from 'classnames'
import { validate, selections } from './Validator'
import { AdminButtons } from '../admin/AdminButtons'
import x from '../images/x.png'
import './Party.css'
import { ObjectUtils } from 'primereact/utils';

export const group = 'group'
export const party = 'party'
export const referendum = 'referendum'

export class Party extends React.Component {

    constructor(props) {
		super(props)
 		this.adminButtons = React.createRef()
    }

    putX(e) {
		if ((!this.adminButtons.current.modalParty.current &&
			 !this.adminButtons.current.modalInsertParty.current &&
			 !this.adminButtons.current.modalCandidates.current) || 
			(!this.adminButtons.current.modalParty.current.state.visible && 
			 !this.adminButtons.current.modalInsertParty.current.state.visible && 
			 !this.adminButtons.current.modalCandidates.current.state.visible)) {
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
                'p-button-icon-left': true,
                'p-button-icon-right': false
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
        if (this.props.votingpaper.props.config.maxCandidates === 0 || 
        	(this.props.party.name && 
        	(!this.props.party.candidates || this.props.party.candidates.length === 0))) {
            const buttonLabel = this.props.party.name || 'p-btn'
            let buttonSublabel = ''
            if (this.props.party.subtitle !== 'undefined')
                buttonSublabel = this.props.party.subtitle
            let subLabel = ''
            if (this.props.party.votingPaper.type !== 'referendum')
            	subLabel = <span className='p-button-subtext p-c'>{buttonSublabel}</span>
            return (<span className='p-button-text p-c'>{buttonLabel}
                        {subLabel}
                    </span>
            )
        }
    }
    
    renderSubLabel() {
		let subLabel = ''
		if (this.props.party.votingPaper.type === 'referendum') {
			let buttonSublabel = ''
            if (this.props.party.subtitle !== 'undefined')
                buttonSublabel = this.props.party.subtitle
			subLabel = <div className='p-button-subtext p-c'>{buttonSublabel}</div>
		}
		return subLabel
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
            'p-button-text-icon-left': this.props.icon && (this.props.party.name || this.props.party.candidates),
            'p-button-text-icon-right': false,
            'p-button-text-only': !this.props.icon && (this.props.party.name || this.props.party.candidates),
            'p-disabled': this.props.disabled
        })
        let icon = this.renderIcon()
        let label = this.renderLabel()
        let subLabel = this.renderSubLabel()
        let candidates = this.renderCandidates()

        let buttonProps = ObjectUtils.findDiffKeys(this.props, Button.defaultProps)

        return (
			<>
            	<div ref={(el) => this.element = el} {...buttonProps} className={className}>
					<AdminButtons party={this.props.party} partyComponent={this} votingPaper={this.props.votingpaper} ref={this.adminButtons}/>
					{icon}
                	{label}
                	{candidates}
                	{this.props.children}
            	</div>
            	{subLabel}
            </>
        )
    }
}
