import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'primereact/button'
import { config } from '../App'
import './DemoSwitch.css'

export class DemoSwitch extends Component {
	
	constructor(data) {
        super(data)
        this.state = {
        }
		this.setAdmin = this.setAdmin.bind(this)
		this.setVota = this.setVota.bind(this)
	}
	
	setAdmin(event) {
		config.admin = true
		const parent = this.props.parent
		const length = parent.state.items.length - 1
        parent.state.items.forEach((votingPaper) => {
			if (votingPaper.id || votingPaper.id >= 0)
            	votingPaper.icon = 'pi pi-fw pi-briefcase'
        })
		parent.state.items.splice(length, 0, { label: '+' })
		parent.forceUpdate()
	}
	
	setVota(event) {
		config.admin = false
		const parent = this.props.parent
		const length = parent.state.items.length - 1
        parent.state.items.forEach((votingPaper) => {
			votingPaper.icon = ''
        })
		parent.state.items.splice(length - 1, 1)
		parent.forceUpdate()
	}
	
	render() {
		if (config.admin)
			return <FormattedMessage
            	id='app.vota'
            	defaultMessage='Vota'>
 					{(label) => <Button className='demo-switch' label={label} onClick={(e) => {
                    		this.setVota(e)
							}
                    	} />
					}
			</FormattedMessage>
		else return <FormattedMessage
            	id='app.admin'
            	defaultMessage='Admin'>
 					{(label) => <Button className='demo-switch' label={label} onClick={(e) => {
                    		this.setAdmin(e)
							}
                    	} />
					}
			</FormattedMessage>
	}
}