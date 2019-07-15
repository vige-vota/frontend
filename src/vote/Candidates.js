import React, { Component } from 'react'
import { AutoComplete } from 'primereact/autocomplete'
import { validate, selections } from './Validator'
import { getVotingPaper, add, remove } from '../Utilities'
import { config } from '../App'
import './Candidates.css'

const placeHolderChars = ' _________________________'

var candidateToRemove

export const candidate = 'candidate'

function update(component) {
	component.candidates = component.props.config
    component.maxCandidates = component.props.maxcandidates
}

export class Candidates extends Component {

    constructor() {
        super()
        this.state = {
            filteredCandidates: null
        }

        this.filterCandidates = this.filterCandidates.bind(this)
        this.chosenCandidates = []
    }

    componentDidUpdate() {
		if (config.admin) {
			update(this)
		}
    }

    componentDidMount() {
		update(this)
    }

    filterCandidates(event) {
        setTimeout(() => {

            let results

            if (event.query.length === 0) {
                results = this.candidates.filter((candidate) => {
                    return !this.chosenCandidates.find(el => el === candidate.name)
                })
            }
            else {
                results = this.candidates.filter((candidate) => {
                    return !this.chosenCandidates.find(el => el === candidate.name) && candidate.name.toLowerCase().startsWith(event.query.toLowerCase())
                })
            }

            this.setState({ filteredCandidates: results })
        }, 250)
    }

    itemTemplate(data) {
        data.type = candidate
        data.votingPaper = getVotingPaper(data)
        let image
        if (data.image)
            image = <img className='excludeSelect' alt={data.name} src={`data:image/jpeg;base64,${data.image}`} style={{ width: '32px', display: 'inline-block', margin: '5px 0 2px 5px' }} />
        return (
            <div className='p-clearfix excludeSelect'>
                {image}
                <div className='excludeSelect' style={{ fontSize: '16px' }}>{data.name}</div>
            </div>
        )
    }

    onDropdownClick(e, i) {
        let dropDown = this.refs['autocomplete-candidate-' + i]
        dropDown.onDropdownClick(e)
        e.stopPropagation()
    }

    onUnselect(e, i, f) {
       if (e.nativeEvent.keyCode === 8) {
            if (candidateToRemove.selected) {
                let stateObject = function () {
                    let returnObj = {}
                    returnObj[candidate + i] = candidateToRemove.name
                    return returnObj
                }
                this.setState(stateObject)
            }
       }
    }

    onAutocompleteChange(e, i) {
        let name = e.value.name

        if (e.value.id)
            if (!validate(e))
                name = placeHolderChars
            else {
                add(e.value, selections)
                e.value.selected = true
            }

        let stateObject = function () {
            let returnObj = {}
            returnObj[candidate + i] = name
            this.chosenCandidates.push(name)
            return returnObj
        }
        let person = this.state[candidate + i]
        if (person) {
            candidateToRemove = this.candidates.filter(e=> e.name === person)[0]
            if (candidateToRemove && validate({ value: candidateToRemove })) {
                let index = this.chosenCandidates.indexOf(person)
                this.chosenCandidates.splice(index, 1)
                this.candidates.forEach((e) => {
                    if (e.name === person) {
                        e.selected = false
                        remove(e, selections)
                    }
                })
            }
        }
        this.setState(stateObject)
    }

    render() {
        let candidates = []
        for (let i = 0; i < this.maxCandidates; i++) {
            candidates.push(<AutoComplete className='excludeSelect' key={'autocomplete-'+candidate+'-' + i} ref={'autocomplete-'+candidate+'-' + i} onClick={(e) => { this.onDropdownClick(e, i) }} value={this.state[candidate + i]} suggestions={this.state.filteredCandidates} completeMethod={this.filterCandidates} size={30} minLength={1}
                placeholder={(i + 1) + placeHolderChars} itemTemplate={this.itemTemplate.bind(this)} selectedItemTemplate={(e) => (i + 1) + ' ' + e} onChange={(e) => this.onAutocompleteChange(e, i)} onKeyUp={(e) => this.onUnselect(e, i, e.name)}>
            </AutoComplete>)
        }
        return (
            <div className='candidates'>
                {candidates}
            </div>)
    }
}