import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import {Calendar} from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { addLocale } from 'primereact/api'
import './Dates.css'

const INTERNAL_DATE_FORMAT = 'dd/mm/yy';
const LOCALE = navigator.language.split(/[-_]/)[0]

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
            date: this.emptyDate,
            submitted: false
        }
        let i18nMonths = <FormattedMessage id='app.admin.dates.months.january'/>
        console.log(i18nMonths)
       					 
        addLocale(LOCALE, {
            firstDayOfWeek: 1,
            dayNamesMin: [
             			 <FormattedMessage id='app.admin.dates.weeks.sunday' defaultMessage='Su' />,
            			 <FormattedMessage id='app.admin.dates.weeks.monday' defaultMessage='Mo' />,
            			 <FormattedMessage id='app.admin.dates.weeks.tuesday' defaultMessage='Tu' />,
            			 <FormattedMessage id='app.admin.dates.weeks.wednesday' defaultMessage='We' />,
            			 <FormattedMessage id='app.admin.dates.weeks.thursday' defaultMessage='Th' />,
            			 <FormattedMessage id='app.admin.dates.weeks.friday' defaultMessage='Fr' />,
            			 <FormattedMessage id='app.admin.dates.weeks.saturday' defaultMessage='Sa' />
            			],
            monthNames: [
             			 <FormattedMessage id='app.admin.dates.months.january' defaultMessage='January' />,
            			 <FormattedMessage id='app.admin.dates.months.february' defaultMessage='February' />,
            			 <FormattedMessage id='app.admin.dates.months.march' defaultMessage='March' />,
            			 <FormattedMessage id='app.admin.dates.months.april' defaultMessage='April' />,
            			 <FormattedMessage id='app.admin.dates.months.may' defaultMessage='May' />,
            			 <FormattedMessage id='app.admin.dates.months.june' defaultMessage='June' />,
            			 <FormattedMessage id='app.admin.dates.months.july' defaultMessage='July' />,
            			 <FormattedMessage id='app.admin.dates.months.august' defaultMessage='August' />,
            			 <FormattedMessage id='app.admin.dates.months.september' defaultMessage='September' />,
            			 <FormattedMessage id='app.admin.dates.months.october' defaultMessage='October' />,
            			 <FormattedMessage id='app.admin.dates.months.november' defaultMessage='November' />,
            			 <FormattedMessage id='app.admin.dates.months.december' defaultMessage='December' />
            			]
        });

        this.state.dateDetailsLabel = <FormattedMessage
            id='app.configuration.datedetails'
            defaultMessage='Date Details'
        />

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
        this.deleteDate = this.deleteDate.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.startingDateTemplate = this.startingDateTemplate.bind(this)
        this.endingDateTemplate = this.endingDateTemplate.bind(this)
    }

    componentDidMount() {
        this.setState({
        	dates: this.props.dates.map((e) => {
        		return {
        			id: this.createId(),
        			startingDate: e.startingDate,
        			endingDate: e.endingDate
        		}
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
    
    saveDate() {
        let state = { submitted: true }

        if (this.state.date) {
            let dates = [...this.state.dates]
            let date = {...this.state.date}
            if (this.state.date.id) {
                const index = this.findIndexById(this.state.date.id)

                dates[index] = date
            }
            else {
                date.id = this.createId()
                dates.push(date)
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

    startingDateTemplate(rowData) {
        return (
            <Calendar locale={ LOCALE } dateFormat={INTERNAL_DATE_FORMAT} showTime hourFormat="24" value={rowData.startingDate} 
    					onChange={(e) => {
							rowData.startingDate = e.value
							this.setState({
								date: rowData
							})
						}}></Calendar>
        )
    }

    endingDateTemplate(rowData) {
        return (
            <Calendar locale={ LOCALE } dateFormat={INTERNAL_DATE_FORMAT} showTime hourFormat="24" value={rowData.endingDate} 
    					onChange={(e) => {
							rowData.endingDate = e.value
							this.setState({
								date: rowData
							})
						}}></Calendar>
        )
    }

    deleteDate(rowData) {
        let dates = this.state.dates.filter(val => val.id !== rowData.id)
        this.setState({
            dates,
            date: this.emptyDate
        })
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
            <Button label={this.state.newDateLabel} icon='pi pi-plus' className='confirm' onClick={this.openNew} />
        )
    }

    actionBodyTemplate(rowData) {
        return (
            <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => this.deleteDate(rowData)} />
        )
    }

    render() {
        const dateDialogFooter = (
            <React.Fragment>
                <FormattedMessage
                    id='app.confirm'
                    defaultMessage='Confirm'>
                    {(yes) => <Button label={yes[0]} icon='pi pi-check' onClick={this.saveDate} className='confirm' />}
                </FormattedMessage>
				<FormattedMessage
                    id='app.cancel'
                    defaultMessage='Cancel'>
                    {(no) => <Button label={no[0]} icon='pi pi-times' onClick={this.hideDialog} className='p-button-secondary confirm' />}
                </FormattedMessage>
            </React.Fragment>
        )
        return (
            <div className='datatable-crud-dates'>

                <div className='card'>
                    <Toolbar className='p-mb-4' left={this.leftToolbarTemplate}></Toolbar>
					<FormattedMessage
                    	id='app.admin.nodatesfound'
                    	defaultMessage='No dates'>
                        {(noRecordsFound) => 
                    		<DataTable ref={(el) => this.dt = el} value={this.state.dates}
                        		dataKey='id' emptyMessage={noRecordsFound[0]}>
                        		<Column field='startingDate' header={this.state.startingDateLabel} body={this.startingDateTemplate} style={{ width: '8.6rem' }}></Column>
                        		<Column field='endingDate' header={this.state.endingDateLabel} body={this.endingDateTemplate} style={{ width: '8.6rem' }}></Column>
                        		<Column body={this.actionBodyTemplate} exportable={false}></Column>
                    		</DataTable>
                        }
                	</FormattedMessage>
                </div>

                <Dialog visible={this.state.dateDialog} header={this.state.dateDetailsLabel} modal className='p-fluid' footer={dateDialogFooter} onHide={this.hideDialog}>
                	<div className='grid'>
    					<div className='col'>{this.state.startingDateLabel}</div>
                    	<div className='col date-modal'><Calendar locale={ LOCALE } dateFormat={INTERNAL_DATE_FORMAT} showTime hourFormat='24' value={this.state.date.startingDate} 
    						onChange={(e) => this.onInputChange(e, 'startingDate')}></Calendar></div>
					</div>
					<div className='grid'>
    					<div className='col'>{this.state.endingDateLabel}</div>
    					<div className='col date-modal'><Calendar locale={ LOCALE } dateFormat={INTERNAL_DATE_FORMAT} showTime hourFormat='24' value={this.state.date.endingDate} 
    						onChange={(e) => this.onInputChange(e, 'endingDate')}></Calendar></div>
    				</div>
                </Dialog>
            </div>
        )
    }
}