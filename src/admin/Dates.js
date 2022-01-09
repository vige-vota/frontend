import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import {Calendar} from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import './Dates.css'

export class Dates extends Component {

    emptyDate = {
        id: null,
        startingDate: null,
        endingDate: null
    }

    constructor(props) {
        super(props)

        this.state = {
            dates: null,
            dateDialog: false,
            deleteDateDialog: false,
            deleteDatesDialog: false,
            date: this.emptyDate,
            selectedDates: null,
            submitted: false
        }

        this.state.newDateLabel = <FormattedMessage
            id='app.configuration.newdate'
            defaultMessage='New date'
        />

        this.state.startingDateLabel = <FormattedMessage
            id='app.configuration.startingdate'
            defaultMessage='Starting date'
        />

        this.state.endingDateLabel = <FormattedMessage
            id='app.configuration.endingdate'
            defaultMessage='Ending date'
        />

        this.leftToolbarTemplate = this.leftToolbarTemplate.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)

        this.openNew = this.openNew.bind(this)
        this.hideDialog = this.hideDialog.bind(this)
        this.saveDate = this.saveDate.bind(this)
        this.confirmDeleteDate = this.confirmDeleteDate.bind(this)
        this.deleteDate = this.deleteDate.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.hideDeleteDateDialog = this.hideDeleteDateDialog.bind(this)
    }

    componentDidMount() {
        this.setState({
        	dates: this.props.dates.map((e) => {
        		e.id = e.startingDate + e.endingDate
        		return e
        	})
        })
    }

    openNew() {
        this.setState({
            date: this.emptyDate,
            submitted: false,
            dateDialog: true
        })
    }

    hideDialog() {
        this.setState({
            submitted: false,
            dateDialog: false
        })
    }

    hideDeleteDateDialog() {
        this.setState({ deleteDateDialog: false })
    }
    
    saveDate() {
        let state = { submitted: true }

        if (this.state.date) {
            let dates = [...this.state.dates]
            let date = {...this.state.date}
            if (this.state.date.id) {
                const index = this.findIndexById(this.state.date.id)

                dates[index] = date
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Date Updated', life: 3000 })
            }
            else {
                date.id = this.createId()
                dates.push(date)
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Date Created', life: 3000 })
            }

            state = {
                ...state,
                dates,
                dateDialog: false,
                date: this.emptyDate
            }
        }

        this.setState(state)
    }

    confirmDeleteDate(date) {
        this.setState({
            date,
            deleteDateDialog: true
        })
    }

    startingDateTemplate(rowData) {
        return (
            <Calendar dateFormat='dd/mm/yy' showTime hourFormat="24" value={rowData.startingDate} 
    					onChange={(e) => {
							rowData.startingDate = e.value
						}}></Calendar>
        )
    }

    endingDateTemplate(rowData) {
        return (
            <Calendar dateFormat='dd/mm/yy' showTime hourFormat="24" value={rowData.endingDate} 
    					onChange={(e) => {
							rowData.endingDate = e.value
						}}></Calendar>
        )
    }

    deleteDate() {
        let dates = this.state.dates.filter(val => val.id !== this.state.date.id)
        this.setState({
            dates,
            deleteDateDialog: false,
            date: this.emptyDate
        })
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Date Deleted', life: 3000 })
    }

    findIndexById(id) {
        let index = -1
        for (let i = 0; i < this.state.dates.length; i++) {
            if (this.state.dates[i].id === id) {
                index = i
                break
            }
        }

        return index
    }

    createId() {
        let id = ''
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return id
    }

    onInputChange(e, name) {
        const val = (e.target && e.target.value) || ''
        let date = {...this.state.date}
        date[`${name}`] = val

        this.setState({ date })
    }

    leftToolbarTemplate() {
        return (
            <Button label={this.state.newDateLabel} icon='pi pi-plus' className='p-button-success p-mr-2' onClick={this.openNew} />
        )
    }

    actionBodyTemplate(rowData) {
        return (
            <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => this.confirmDeleteDate(rowData)} />
        )
    }

    render() {
        const dateDialogFooter = (
            <React.Fragment>
                <Button label='Cancel' icon='pi pi-times' className='p-button-text' onClick={this.hideDialog} />
                <Button label='Save' icon='pi pi-check' className='p-button-text' onClick={this.saveDate} />
            </React.Fragment>
        )
        const deleteDateDialogFooter = (
            <React.Fragment>
                <Button label='No' icon='pi pi-times' className='p-button-text' onClick={this.hideDeleteDateDialog} />
                <Button label='Yes' icon='pi pi-check' className='p-button-text' onClick={this.deleteDate} />
            </React.Fragment>
        )
        return (
            <div className='datatable-crud-demo'>
                <Toast ref={(el) => this.toast = el} />

                <div className='card'>
                    <Toolbar className='p-mb-4' left={this.leftToolbarTemplate}></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.state.dates} selection={this.state.selectedDates} onSelectionChange={(e) => this.setState({ selectedDates: e.value })}
                        dataKey='id' responsiveLayout='scroll'>
                        <Column field='startingDate' header={this.state.startingDateLabel} body={this.startingDateTemplate} style={{ width: '8.6rem' }}></Column>
                        <Column field='endingDate' header={this.state.endingDateLabel} body={this.endingDateTemplate} style={{ width: '8.6rem' }}></Column>
                        <Column body={this.actionBodyTemplate} exportable={false}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.dateDialog} style={{ width: '450px' }} header='Date Details' modal className='p-fluid' footer={dateDialogFooter} onHide={this.hideDialog}>
                    <div className='col'><Calendar dateFormat='dd/mm/yy' showTime hourFormat='24' value={this.state.date.startingDate} 
    					onChange={(e) => this.onInputChange(e, 'startingDate')}></Calendar></div>
    				<div className='col'><Calendar dateFormat='dd/mm/yy' showTime hourFormat='24' value={this.state.date.endingDate} 
    					onChange={(e) => this.onInputChange(e, 'endingDate')}></Calendar></div>
                </Dialog>

                <Dialog visible={this.state.deleteDateDialog} style={{ width: '450px' }} header='Confirm' modal footer={deleteDateDialogFooter} onHide={this.hideDeleteDateDialog}>
                    <div className='confirmation-content'>
                        <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem'}} />
                        {this.state.date && <span>Are you sure you want to delete <b>{this.state.date.id}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        )
    }
}