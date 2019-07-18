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
import axios from 'axios'

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
        this.confirm = this.confirm.bind(this)
        this.onHide = this.onHide.bind(this)
    }

    open() {
        this.setState({ visible: true })
    }

    confirm() {
    	
    	axios
    		.post(process.env.REACT_APP_VOTE_URL, selections)
    		.then(function(response) {
    			this.setState({ visible: false })
    			this.props.window.setState({ visible: false })
    		})
    		.catch(function(error) {
    			console.log(error)
    		});
    }

    onHide() {
        this.setState({ visible: false })
    }

    componentDidUpdate() {
        let elements = ReactDOM.findDOMNode(this).getElementsByClassName('p-rowgroup-header')
    	config.votingPapers.forEach((votingPaper) => {
			for (let i=0; i < elements.length; i++)
				if (elements[i] && elements[i].innerHTML.indexOf('id="'+votingPaper.id) >= 0) {
					elements[i].style.setProperty('background-color', '#'+votingPaper.color)
					elements[i].style.setProperty('border-color', '#'+votingPaper.color)
				}
		})
    }

    headerTemplate(data) {
        return <span className='voting-paper-field' id={data.votingPaper.id}>{data.votingPaper.name}</span>
    }

    footerTemplate(data, index) {
        return ([<td key={data.votingPaper.name + '_footerTotalLabel'} colSpan='2'></td>
        ]
        );
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
                    {(yes) => <Button label={yes} icon='pi pi-check' onClick={this.confirm} className='confirm' />}
                </FormattedMessage>

                <FormattedMessage
                    id='app.no'
                    defaultMessage='No'>
                    {(no) => <Button label={no} icon='pi pi-times' onClick={this.onHide} className='p-button-secondary confirm' />}
                </FormattedMessage>
            </div>
        )
		return (
            <Dialog contentStyle={{'maxHeight': '500px'}} header={this.state.confirmHeader} visible={this.state.visible} footer={footer} onHide={this.onHide}>
                {this.state.confirmBody}<br/><br/>
                <FormattedMessage
                    id='app.confirm.norecordsfound'
                    defaultMessage='Empty selection'>
                        {(noRecordsFound) => <DataTable value={this.sort(selections)} rowGroupMode='subheader' sortField='votingPaper' sortOrder={1} groupField='votingPaper'
                            rowGroupHeaderTemplate={this.headerTemplate} rowGroupFooterTemplate={this.footerTemplate} emptyMessage={noRecordsFound}>
                                <Column field='type' body={(e) =>

                                (<b><FormattedMessage
                                    id={'app.confirm.'+e.type}
                                    defaultMessage={e.type} /></b>)

                                }/>
                                <Column field='name' />
                         </DataTable>
                        }
                </FormattedMessage>
            </Dialog>)
    }
}