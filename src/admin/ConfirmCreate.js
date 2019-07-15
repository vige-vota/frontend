import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

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
        this.confirm = this.confirm.bind(this)
        this.onHide = this.onHide.bind(this)
    }

    open() {
        this.setState({ visible: true })
    }

    confirm() {
        this.setState({ visible: false })
    }

    onHide() {
        this.setState({ visible: false })
    }

    headerTemplate(data) {
        return <span className='voting-paper-field' id={data.votingPaper.id}>{data.votingPaper.name}</span>
    }

    footerTemplate(data, index) {
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
            </Dialog>)
    }
}