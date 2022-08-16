import React, { Component } from 'react'
import {Toast} from 'primereact/toast'
import { FormattedMessage } from 'react-intl'
import {getParent} from '../Utilities'
import {party, group, referendum} from './Party'
import {candidate} from './Candidates'

export const M = 'M'
export const F = 'F'

export const validate = (e) => {

    let votingPaper = e.value.votingPaper
    let selectionsInVotingPaper = selections.filter(e => e.votingPaper === votingPaper)
	
    if (e.value.type === group) {
        let groupsInTheSameVotingPaper = selectionsInVotingPaper.filter((e) => e.type === group)

        if (e.value.selected || groupsInTheSameVotingPaper.length < 1 || groupsInTheSameVotingPaper.filter(f => f === e.value).length === 1)
            return true
        else {
            errors({name: e.value.name, type: <FormattedMessage id='app.error.group' defaultMessage={'the '+ group}/>})
            return false
        }
    } else if (e.value.type === party) {
        let parent = getParent(e.value)
        let partiesInTheSameGroup = selectionsInVotingPaper.filter((e) => getParent(e) === parent && e.type === party)
        let groupsInTheSameVotingPaper = selectionsInVotingPaper.map((e) => e.type === party ? getParent(e) : null).filter((e, f, g) => g.indexOf(e) === f && e);
        let hasCandidates = selectionsInVotingPaper.filter(f => f.type === candidate && getParent(f) === e.value).length > 0

        if (e.value.selected || hasCandidates || (partiesInTheSameGroup.length < 1 &&
            groupsInTheSameVotingPaper.length < 1 &&
            (votingPaper.disjointed || selectionsInVotingPaper.filter(e => e === parent).length > 0 || selectionsInVotingPaper.length === 0)))
            return true
        else {
			if (e.value.votingPaper.type === referendum)
           		errors({name: e.value.name, type: <FormattedMessage id='app.error.referendum' defaultMessage={'the '+ referendum}/>})
           	else
           		errors({name: e.value.name, type: <FormattedMessage id='app.error.party' defaultMessage={'the '+ party}/>})
            return false
        }
    } else {
        let parent = getParent(e.value)
        let candidatesInTheSameVotingPaper = selectionsInVotingPaper.filter((e) => e.type === candidate)
        let candidatesInTheSameParty = candidatesInTheSameVotingPaper.filter((e) => getParent(e) === parent)
        let existingParties = selectionsInVotingPaper.filter((f) => f.type === party)
        let selectedCurrentParty = existingParties.filter((f) => f === getParent(e.value))
        let selectedOtherParties = existingParties.filter((f) => f !== getParent(e.value))
        let existingPartiesOrGroups = selectionsInVotingPaper.filter(e => e === parent || e === getParent(parent))

        if (((!votingPaper.disjointed &&
             (existingPartiesOrGroups.length > 0 || selectionsInVotingPaper.length === 0)) ||
             (votingPaper.disjointed &&
             (selectedCurrentParty.length === 1 || selectedOtherParties.length === 0))
            ) &&
             validateSex(candidatesInTheSameParty, e.value)
            )
            return true
        else {
            errors({name: e.value.name, type: <FormattedMessage id='app.error.candidate' defaultMessage={'the '+ candidate}/>})
            return false
        }
    }
}

const validateSex = (list, value) => {
    let counterM = 0
    let counterF = 0
    let filteredList = list.filter(e => e !== value)
    let length = filteredList.length
    if (!value.selected) {
        if (value.sex === M)
            counterM++
        if (value.sex === F)
            counterF++
        length++
    }
    filteredList.forEach(e => {
         if (e.sex === M)
            counterM++
         if (e.sex === F)
            counterF++
    })
    return Math.round(length / 2) >= counterM && Math.round(length / 2) >= counterF
}

var errors

export const selections = []

export class Validator extends Component {

    constructor() {
        super()
        errors = this.errors.bind(this)
    }

    errors(errors) {
        let summary = <FormattedMessage id='app.error' defaultMessage='Error'/>
        let detail = <FormattedMessage id='app.error.message' defaultMessage='Unable to select {type} {value}'
            values = {{ type: errors.type, value: errors.name }}/>
        let growlToShow = {severity: 'error', summary: summary, detail: detail}
        this.growl.show(growlToShow)
    }

    render() {
        return <Toast ref={(el) => this.growl = el}></Toast>
    }
}