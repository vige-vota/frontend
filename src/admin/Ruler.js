import React, { Component } from 'react'
import {Growl} from 'primereact/growl'
import { FormattedMessage } from 'react-intl'
import { selections } from '../vote/Validator'

export const validateDisjointed = (component) => {
	if (component) {
		let selectionsInVotingPaper = selections.filter(e => e.votingPaper.id === component.id)
		if (selectionsInVotingPaper.length > 0) {
    		errors({name: 'name', message: <FormattedMessage id='app.admin.error.disjointed' defaultMessage='You must deselect all votes of the voting paper before to change the disjointed vote &#39;{name}&#39;' values = {{ name: component.label }}/>})
    		return false
		} else return true
	} else return true
}

export const validateVotingPaper = (component, list) => {
	let value = component.votingPaper.value
	if (!value || !value.label) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.name' defaultMessage='The name of the voting paper is mandatory'/>})
    	return false
	} else if (!value || value.label.length > 50) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.maxname' defaultMessage='You can specify a maximum length of {number} characters for the name' values = {{ number: 50 }}/>})
    	return false
	} else if (!value || ((component.type === 'bigger' || component.type === 'bigger-partygroup') && component.zone === -1)) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.zonebigger' defaultMessage='The voting paper must have the zone'/>})
    	return false
	} else if (!value || list.filter(e => e.name.toUpperCase() === value.label.toUpperCase() && e.id !== value.id).length > 0) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.existingname' defaultMessage='The name of the voting paper already exists'/>})
    	return false
	} else if (!value || list.filter(e => ((component.type === 'little-nogroup' && e.type !== 'little-nogroup') || (component.type !== 'little-nogroup' && e.type === 'little-nogroup')) && e.id === value.id).length > 0) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.littlenogroup' defaultMessage='You cannot pass from a party voting paper to a group voting paper. Remove and create again the voting paper'/>})
    	return false
	}
    return true
}

export const validateParty = (component) => {
	if (!component || !component.name) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.party.name' defaultMessage='The name of the party is mandatory'/>})
    	return false
	} else if (!component || component.name.length > 40) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.maxname' defaultMessage='You can specify a maximum length of {number} characters for the name' values = {{ number: 40 }}/>})
    	return false
	} else return true
}

export const validateGroup = (component) => {
	if (!component || !component.name) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.group.name' defaultMessage='The name of the group is mandatory'/>})
    	return false
	} else if (!component || component.name.length > 40) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.maxname' defaultMessage='You can specify a maximum length of {number} characters for the name' values = {{ number: 40 }}/>})
    	return false
	} else return true
}

export const validateCandidate = (component, list) => {
	if (!component || !component.name) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.candidate.name' defaultMessage='The name of the candidate is mandatory'/>})
    	return false
	} else if (!component || !component.sex) {
    	errors({name: 'sex', message: <FormattedMessage id='app.admin.error.candidate.sex' defaultMessage='The sex of the candidate is mandatory'/>})
    	return false
	} else if (!component || component.name.length > 40) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.maxname' defaultMessage='You can specify a maximum length of {number} characters for the name' values = {{ number: 40 }}/>})
    	return false
	} else if (!component || list.filter(e => e.name.toUpperCase() === component.name.toUpperCase() && e.id !== component.id).length > 0) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.candidate.existingname' defaultMessage='The name of the candidate already exists'/>})
    	return false
	} else if (!component || (component.image && list.filter(e => e.image === component.image && e.id !== component.id).length > 0)) {
    	errors({name: 'image', message: <FormattedMessage id='app.admin.error.candidate.existingimage' defaultMessage='The image of the candidate already exists'/>})
    	return false
	} else if (!component || component.name.length < 6 || !component.name.includes(' ') ) {
    	errors({name: 'name', message: <FormattedMessage id='app.admin.error.candidate.surname' defaultMessage='Insert name and surname please'/>})
    	return false
	} else return true
}

var errors

export class Ruler extends Component {

    constructor() {
        super()
        errors = this.errors.bind(this)
    }

    errors(errors) {
        let summary = <FormattedMessage id='app.error' defaultMessage='Error'/>
        let growlToShow = {severity: 'error', summary: summary, detail: errors.message}
        this.growl.show(growlToShow)
    }

    render() {
        return <Growl ref={(el) => this.growl = el}></Growl>
    }
}