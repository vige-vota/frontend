import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import './ConfirmVote.css'
import { selections } from './Validator'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { config } from '../App'
import UserService from '../services/UserService'
import { party, group, referendum } from './Party'
import { candidate } from './Candidates'
import { getParent } from '../Utilities'

const ASC = 'ascending'
const DSC = 'descending'

export class ConfirmVote extends Component {

    constructor(data) {
        super(data)
        this.state = {
        }
        this.state.confirmHeader = <FormattedMessage
            id='app.confirm.header'
            defaultMessage='Confirm your vote'
        />

        this.state.confirmBody = <FormattedMessage
            id='app.confirm.body'
            defaultMessage='By clicking on (Yes) you will confirm the sending of the data. Once confirmed you will not be able to go back. Confirm the rescue?'
        />
        this.open = this.open.bind(this)
        this.errors = this.errors.bind(this)
        this.confirm = this.confirm.bind(this)
        this.onHide = this.onHide.bind(this)
        this.show = this.show.bind(this)
    }

    open() {
        this.setState({ visible: true })
    }

    errors(errors) {
        let summary = <FormattedMessage id='app.error' defaultMessage='Error'/>
        this.props.window.refs.validator.growl.show({severity: 'error', summary: summary, detail: errors.message})
    }
    
    createVote() {
    	let vote = {}
    	vote.votingPapers = []
    	config.votingPapers.forEach( e => vote.votingPapers.push({ id: e.id }) )
    	selections.forEach(e => {
    		let votingPaper = e.votingPaper
    		let value = {}
    		let partyV = {}
    		for (let i = 0; i< vote.votingPapers.length;i++)
    			if (vote.votingPapers[i].id === votingPaper.id)
    				value = vote.votingPapers[i]
    			
    		if (!value.id && value.id !== 0) {
    			value.id = votingPaper.id
    			vote.votingPapers.push(value)
    		}
    		
    		if (e.type === group && e.votingPaper.type !== referendum)
    			value.group = { id: e.id }
    		else if (e.type === party) {
				if (!value.parties)
					value.parties = []
    			partyV.id = e.id
    			value.parties.push(partyV)
    		} else if (e.type === candidate) {
    			if (!partyV.candidates)
    				partyV.candidates = []
    			partyV.candidates.push({ id: e.id })
    		}
    	})
    	return vote
    }
    
    confirm() {
    	UserService.updateToken()
    	.then(() => {
    		UserService.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + UserService.getToken()
    		this.doConfirm()
    	})
    }

    doConfirm() {
    	let button = ReactDOM.findDOMNode(this).querySelectorAll('.pi-check')[0]
    	button.className = 'pi pi-spin pi-spinner p-c p-button-icon-left'
    	UserService.axiosInstance
    		.post(process.env.REACT_APP_VOTING_URL, this.createVote())
    		.then(response => {
    	    	button.className = 'pi pi-check p-c p-button-icon-left'
    			this.setState({ visible: false })
    			this.props.window.setState({ visible: false })
    			return response
		      })
    		.catch(error => {
    	    	button.className = 'pi pi-check p-c p-button-icon-left'
    			this.errors(error)
    		});
    }

    onHide() {
        this.setState({ visible: false })
    }

    show() {
    	let node = ReactDOM.findDOMNode(this)
    	if (node) {
        	let elements = node.getElementsByClassName('p-rowgroup-header')
    		config.votingPapers.forEach((votingPaper) => {
				for (let i=0; i < elements.length; i++)
					if (elements[i] && elements[i].innerHTML.indexOf('id="'+votingPaper.id) >= 0) {
						elements[i].style.setProperty('background-color', '#'+votingPaper.color)
						elements[i].style.setProperty('border-color', '#'+votingPaper.color)
					}
			})
		}
    }

    headerTemplate(data) {
        return <span className='voting-paper-field' id={data.votingPaper.id}>{data.votingPaper.name}</span>
    }

    footerTemplate(data) {
        return ([<td key={data.votingPaper.name + '_footerTotalLabel'} colSpan='2'></td>
        ]
        )
    }

    sortByElement(a, b, order = ASC) {
        const diff = a.votingPaper.id - b.votingPaper.id + a.type.toLowerCase().localeCompare(b.type.toLowerCase())

        if (order === ASC) {
            return diff
        }

        return -1 * diff
    }

    sort(list) {
        return list.sort((a, b) => this.sortByElement(a, b, DSC))
    }

    render() {
        const footer = (
            <div>
                <FormattedMessage
                    id='app.yes'
                    defaultMessage='Yes'>
                    {(yes) => <Button label={yes[0]} icon='pi pi-check' onClick={this.confirm} className='confirm' />}
                </FormattedMessage>

                <FormattedMessage
                    id='app.no'
                    defaultMessage='No'>
                    {(no) => <Button label={no[0]} icon='pi pi-times' onClick={this.onHide} className='p-button-secondary confirm' />}
                </FormattedMessage>
            </div>
        )
        
		return (
            <Dialog className='confirm-vote' contentStyle={{'maxHeight': '500px'}} header={this.state.confirmHeader} visible={this.state.visible} footer={footer} onHide={this.onHide} onShow={this.show}>
                {this.state.confirmBody}<br/><br/>
                <FormattedMessage
                    id='app.confirm.norecordsfound'
                    defaultMessage='Empty selection'>
                        {(noRecordsFound) => <DataTable value={this.sort(selections)} rowGroupMode='subheader' sortField='votingPaper' sortOrder={1} groupRowsBy='votingPaper'
                            rowGroupHeaderTemplate={this.headerTemplate} rowGroupFooterTemplate={this.footerTemplate} emptyMessage={noRecordsFound[0]}>
                                <Column body={(e) => {
										if (e.votingPaper.type === referendum)
											return (<b>{e.name}</b>)
										else
                                			return (<b><FormattedMessage
                                    			id={'app.confirm.' + e.type}
                                    			defaultMessage={e.type} /></b>)
									}
                                } />
                                <Column body={(e) => {
									if (e.votingPaper.type === referendum) {
										let parent = getParent(e)
										return parent.name
									} else return e.name
								}}/>
                         </DataTable>
                        }
                </FormattedMessage>
            </Dialog>)
    }
}