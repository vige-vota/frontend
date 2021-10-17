import React from 'react'
import { config } from './App'
import ReactDOM from 'react-dom'
import { FormattedMessage } from 'react-intl'
import UserService from './services/UserService'

export const isValid = (votingPaper, msg) => {
 	if (msg.state === 'PREPARE') {
    	return UserService.getRoles().includes('admin') || getValueByIdAntVotingPaper(parseInt(config.profile.attributes['block'][0], 10), votingPaper) !== ''
    } else {
    	return votingPaper.zone === -1 || config.profile.attributes['zones'].includes(votingPaper.zone.toString())
    }
}
    
export const hasIdInTheTree = (value, id) => {
    while (value !== null) {
    	if (value.id === id)
    		return true
        value = getParent(value)
    }
    return false
}
    
export const getVotingPaper = (value) => {
    let parent = getParent(value)
    if (parent != null)
        return getVotingPaper(parent)
    else return value
}

export const getVotingPaperById = (value) => {
	if (value) {
		let result = ''
    	config.votingPapers.forEach(votingPaper => {
			if (votingPaper.id === value.id)
				result = votingPaper
		})
		return result
	} else return ''
}

export const getValueById = (id) => {
	let valuer = ''
	if (id) {
    	config.votingPapers.forEach((votingPaper) => {
    		valuer = getValueByIdAntVotingPaper(id, votingPaper)
		})
	}
	return valuer
}

export const getValueByIdAntVotingPaper = (id, votingPaper) => {
	let valuer = ''
	if (id) {
		if (votingPaper.id === id)
			valuer = votingPaper
		if (votingPaper.groups)
			votingPaper.groups.forEach((group) => {
				if (group.id === id)
					valuer = group
				if (group.parties)
					group.parties.forEach((party) => {
						if (party.id === id)
							valuer = party
			    		if (party.candidates)
							party.candidates.forEach((candidate) => {
								if (candidate.id === id)
									valuer = candidate
							})
						})
				})
		}
	return valuer
}

export const updateSelections = (votingPaper, currentVotingPaper) => {
	let groups = votingPaper.groups
	let currentGroups = currentVotingPaper.groups
	if (groups && currentGroups)
		groups.forEach((group) => {
			currentGroups.forEach((currentGroup) => {
				if (group.id === currentGroup.id) {
					group.selected = currentGroup.selected
					let parties = group.parties
					let currentParties = currentGroup.parties
					if (parties && currentParties)
						parties.forEach((party) => {
							currentParties.forEach((currentParty) => {
								if (party.id === currentParty.id) {
									party.selected = currentParty.selected
									let candidates = party.candidates
									let currentCandidates = party.currentCandidates
									if (candidates && currentCandidates)
										candidates.forEach((candidate) => {
											currentCandidates.forEach((currentCandidate) => {
												if (candidate.id === currentCandidate.id)
													candidate.selected = currentCandidate.selected
											})
										})
								}
							})
						})
				}
			})
		})
		let parties = votingPaper.parties
		let currentParties = currentVotingPaper.parties
		if (parties && currentParties)
			parties.forEach((party) => {
				currentParties.forEach((currentParty) => {
					if (party.id === currentParty.id) {
							party.selected = currentParty.selected
							let candidates = party.candidates
							let currentCandidates = party.currentCandidates
							if (candidates && currentCandidates)
								candidates.forEach((candidate) => {
									currentCandidates.forEach((currentCandidate) => {
										if (candidate.id === currentCandidate.id)
											candidate.selected = currentCandidate.selected
									})
								})
					}
				})
			})
}

export const isParty = (value) => {
    let parent = getParent(value)
    return parent != null && parent.parties
}

export const isGroup = (value) =>  {
    let parent = getParent(value)
    return parent != null && parent.groups
}

export const isCandidate = (value) => {
    let parent = getParent(value)
    return parent != null && parent.candidates
}

export const add = (value, list) => {
    if (list.filter(e => e === value).length === 0)
        list.push(value)
    let parent = getParent(value)
    if (parent.votingPaper && (!isGroup(parent) || !parent.votingPaper.disjointed)) {
        add(parent, list)
    }
}

export const addToList = (value, index, list) => {
	const left = list.slice(0, index)
	const right = list.slice(index)
	return left.concat(value, right)
}

export const generateId = () => {
	let id = -config.nextId
	config.nextId++;
	return id
}

export const getTabs = (component) => {
    return ReactDOM.findDOMNode(component).querySelectorAll('.p-menuitem-link')
}

export const createTabs = (appContainer) => {
	let activeItem = {}
    if (config.votingPapers && config.votingPapers[0])
        activeItem = { id: config.votingPapers[0].id, label: config.votingPapers[0].name }
        appContainer.setState({
            activeItem: activeItem
        })
        config.votingPapers.map((votingPaper) => {
			if (config.state === 'PREPARE' && (UserService.getRoles().includes('admin') || parseInt(config.profile.attributes['block'][0], 10) === votingPaper.id))
            	return appContainer.state.items.push({ id: votingPaper.id, label: votingPaper.name, icon: 'pi pi-fw pi-briefcase' })
			else
				return appContainer.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        })
        appContainer.setState({confirmButtonLabel : <FormattedMessage
            		id='app.confirm'
            		defaultMessage='Confirm'
        			/>})
		if (config.state === 'PREPARE' && UserService.getRoles().includes('admin'))
			 appContainer.state.items.push({ label: '+' })
	    if (config.votingPapers.length > 0 || config.state === 'PREPARE')
	    	 appContainer.state.items.push({ label: appContainer.state.confirmButtonLabel })
		const tabs = colorTabs(appContainer)
		if (tabs && tabs[0])
			tabs[0].click()
}

export const colorTabs = (component) => {
    const tabs = getTabs(component)
    config && config.votingPapers.forEach((votingPaper, i) => {
		if (!tabs[i].className.includes(votingPaper.type))
			tabs[i].className = tabs[i].className + ' App-' + votingPaper.id+' ' + votingPaper.type
		tabs[i].style.setProperty('background-color', '#'+votingPaper.color)
		tabs[i].style.setProperty('border-color', '#'+votingPaper.color)
    })
	return tabs
}

export const removeTab = (e, component) => {
	let index = component.state.items.map((e) => e.id).indexOf(e.id)
	if (component.state.activeItem.id === e.id) {
		const tabs = getTabs(component)
		if (index !== 0)
        	tabs[0].click()
		else
			tabs[1].click()
	}
	component.state.items.splice(index, 1)
	config.votingPapers.splice(index, 1)
    component.forceUpdate()
}

export const remove = (value, list) => {
    if (list.filter(e => getParent(e) === value).length === 0 ||
        (isGroup(value) && value.votingPaper.disjointed)) {
        let index = list.indexOf(value)
        list.splice(index, 1)
        let parent = getParent(value)
        if (parent.votingPaper &&
            (!isGroup(parent) || !parent.votingPaper.disjointed) &&
            !parent.selected &&
            (!isCandidate(value) || list.filter(e => isCandidate(e) && getParent(e) === parent).length === 0)) {
                remove(parent, list)
        }
    }
}

export const getParent = (value) =>  {
    let parent = null
    config.votingPapers.forEach((votingPaper) => {
        if (votingPaper !== value) {
             if (votingPaper.groups)
                 votingPaper.groups.forEach((group) => {
                     if (group === value)
                         parent = votingPaper
                     else {
                         if (group.parties)
                             group.parties.forEach((party) => {
                                 if (party === value)
                                     parent = group
                                 else {
                                     if (party.candidates)
                                         party.candidates.forEach((candidate) => {
                                             if (candidate === value)
                                                 parent = party
                             })
                     }})
             }})
             else if (votingPaper.parties)
            	 votingPaper.parties.forEach((party) => {
                     if (party === value)
                         parent = votingPaper
                     else {
                         if (party.candidates)
                             party.candidates.forEach((candidate) => {
                                 if (candidate === value)
                                     parent = party
                 })
         }})
     }})
     return parent
}

export const addImage = (url, component) => {
	const reader = new FileReader();
	reader.onload = function () {
  		component.setState({ image: reader.result.replace(/^data:.+;base64,/, '')})
		component.forceUpdate()
	};

	let xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'blob'
	xhr.onload = function() {
  		if (this.status === 200) {
    		reader.readAsDataURL(this.response)
  		}
	};
	xhr.send()
} 

export const base64ToFile = (component) => {
   const type = 'image/jpeg'
   const byteCharacters = atob(component.image);
   const byteNumbers = new Array(byteCharacters.length);
   for (let i = 0; i < byteCharacters.length; i++) {
    	byteNumbers[i] = byteCharacters.charCodeAt(i);
   }
   const byteArray = new Uint8Array(byteNumbers);
   const blob = new Blob([byteArray], {type: type});   
   let file = new File([blob], component.name, {type: type})
   return file
}