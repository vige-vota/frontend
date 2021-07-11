import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { config } from '../App'
import UserService from '../services/UserService'
import stringify from 'json-stringify-safe'

export class ConfirmCreate extends Component {

    constructor(data) {
        super(data)
        this.state = {
        }
        this.state.confirmHeader = <FormattedMessage
            id='app.confirm.ins.header'
            defaultMessage='Confirm your update'
        />

        this.state.confirmBody = <FormattedMessage
            id='app.confirm.ins.body'
            defaultMessage='By clicking on (Yes) you will confirm the sending of the data. Confirm the rescue?'
        />
        this.open = this.open.bind(this)
        this.errors = this.errors.bind(this)
        this.confirm = this.confirm.bind(this)
        this.onHide = this.onHide.bind(this)
    }

    open() {
        this.setState({ visible: true })
    }

    errors(errors) {
        this.props.window.refs.ruler.errors({message: errors.message})
    }

    doConfirm() {
    	let json = JSON.parse(stringify(config))
    	let button = ReactDOM.findDOMNode(this).querySelectorAll('.pi-check')[0]
    	button.className = 'pi pi-spin pi-spinner p-c p-button-icon-left'
    	UserService.axiosInstance
		.post(process.env.REACT_APP_VOTING_PAPERS_URL, json)
		.then(response => {
	    	  button.className = 'pi pi-check p-c p-button-icon-left'
			  this.setState({ visible: false })
		      return response
		})
		.catch(error => {
			this.errors(error)
	    	button.className = 'pi pi-check p-c p-button-icon-left'
			console.log(error)
		})
    }
    
    confirm() {
    	UserService.updateToken()
    	.then(() => {
    		UserService.axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + UserService.getToken()
    		this.doConfirm()
    	})
    }

    onHide() {
        this.setState({ visible: false })
    }

    headerTemplate(data) {
        return <span className='voting-paper-field' id={data.votingPaper.id}>{data.votingPaper.name}</span>
    }

    footerTemplate(data) {
        return ([<td key={data.votingPaper.name + '_footerTotalLabel'} colSpan='2'></td>
        ]
        );
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
            <Dialog contentStyle={{'maxHeight': '500px'}} header={this.state.confirmHeader} visible={this.state.visible} footer={footer} onHide={this.onHide}>
        		{this.state.confirmBody}<br/><br/>
            </Dialog>)
    }
}