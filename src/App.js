import React, { Component } from 'react'
import { VotingPaper } from './vote/VotingPaper'
import { ConfirmVote } from './vote/ConfirmVote'
import { ConfirmCreate } from './admin/ConfirmCreate'
import { ModalVotingPaper } from './admin/ModalVotingPaper'
import { TabMenu } from 'primereact/tabmenu'
import { FormattedMessage } from 'react-intl'
import './App.css'
import { Validator } from './vote/Validator'
import { Ruler } from './admin/Ruler'
import background from './images/background.png'
import logo from './images/logo.ico'
import {Panel} from 'primereact/panel';
import {getTabs, colorTabs, removeTab, getVotingPaperById, addToList} from './Utilities'
import SockJsClient from './SockJsClient'
import UserService from './services/UserService'

export var config

class App extends Component {

    constructor() {
       super()
       this.state = {
          items: [
          ],
          visible: true
       }
       UserService.axiosInstance.get(process.env.REACT_APP_VOTING_PAPERS_URL)
        	.then(function(response) {
        		config = response.data.config
        		let activeItem = {}
        		if (config.votingPapers && config.votingPapers[0])
        			activeItem = { id: config.votingPapers[0].id, label: config.votingPapers[0].name }
        		this.setState({
          		    activeItem: activeItem
        		})
        		config.votingPapers.map((votingPaper) => {
					if (config.admin)
            			return this.getState().items.push({ id: votingPaper.id, label: votingPaper.name, icon: 'pi pi-fw pi-briefcase' })
					else 
						return this.getState().items.push({ id: votingPaper.id, label: votingPaper.name })
        		})
        		this.setState({confirmButtonLabel : <FormattedMessage
            		id='app.confirm'
            		defaultMessage='Confirm'
        			/>})
				if (config.admin)
			 		this.getState().items.push({ label: '+' })
	    		if (config.votingPapers.length > 0 || config.admin)
	    			this.getState().items.push({ label: this.state.confirmButtonLabel })
	    	})
			.catch(function(error) {
				console.log(error)
			});
    }

    componentDidMount() {
		const tabs = colorTabs(this)
		if (tabs && tabs[0])
			tabs[0].click()
    }

	componentDidUpdate() {
		if (this.state.operation === 'websocket') {
			colorTabs(this)
			this.setState({operation: undefined})
		}
	}

    render() {
		let confirm = <ConfirmVote ref='confirm' window={this}/>
		let modalVotingPaper = ''
		let ruler = ''
		let realTimeVotes = ''
		if (config && config.admin) {
			confirm = <ConfirmCreate ref='confirm' window={this}/>
			modalVotingPaper = <ModalVotingPaper ref='modalVotingPaper' />
			ruler = <Ruler ref='ruler' />
			realTimeVotes = <SockJsClient url={process.env.REACT_APP_VOTING_PAPERS_REALTIME_URL} topics={['/topic/votingpaper']}
						onMessage={(msg) => {
							msg.votingPapers.forEach((votingPaper, i) => {
								let currentItem = this.state.items[i]
								if (this.state.items.filter(e => e.id === votingPaper.id).length === 0) {
									config.votingPapers.push(votingPaper)
									const length = this.state.items.length-2
									this.setState({ items: addToList({ id: votingPaper.id, label: votingPaper.name, icon: 'pi pi-fw pi-briefcase' }, length, this.state.items) })
								} else if (currentItem.id === votingPaper.id) {
									if (currentItem)
										currentItem.label = votingPaper.name
									let currentVotingPaper = config.votingPapers[i]
									if (currentVotingPaper) {
										currentVotingPaper.type = votingPaper.type
										currentVotingPaper.disjointed = votingPaper.disjointed
										currentVotingPaper.color = votingPaper.color
										currentVotingPaper.maxCandidates = votingPaper.maxCandidates
										currentVotingPaper.name = votingPaper.name
										currentVotingPaper.groups = votingPaper.groups
										currentVotingPaper.parties = votingPaper.parties
									}
								}
							})
							let toRemove = config.votingPapers.filter(value => -1 === msg.votingPapers.map(e => e.id).indexOf(value.id))
							toRemove.forEach(item => removeTab(item, this))
							const tabs = getTabs(this)
							let index = this.state.items.map((e) => e.id).indexOf(this.state.activeItem.id)
							if (index >= 0)
								tabs[index].click()
							this.setState({operation: 'websocket'})
					 }} />
		}
        return (
            <div className='App'>
            	{realTimeVotes}
                <div className='content-section implementation'>
                    <Validator ref='validator' />
					{ruler}
                    <TabMenu ref='tabMenu' className={this.state.visible ? '' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                    	if (config.admin && e.originalEvent.target.className.startsWith('pi')) {
							let currentVotingPaper = getVotingPaperById(e.value)
							this.refs.modalVotingPaper.setState({
								votingPaper: e,
								app: this,
								operation: 'update',
								disjointed: currentVotingPaper.disjointed,
								maxCandidates: currentVotingPaper.maxCandidates,
								color: currentVotingPaper.color,
								type: currentVotingPaper.type
							})
							this.refs.modalVotingPaper.open()
						} else if (this.state.visible) {
                            if (e.value.label === this.state.confirmButtonLabel)
                                this.refs.confirm.open()
                            else {
								if (e.value.label === '+') {
									this.refs.modalVotingPaper.setState({
										votingPaper: '',
										app: this,
										operation: 'insert',
										disjointed: false,
										maxCandidates: 0,
										color: '1976D2',
										type: 'bigger'
									})
                                	this.refs.modalVotingPaper.open()
                             	} else 
                                	this.setState({ activeItem: e.value })
							}
						}
                    }
                    } />

					{modalVotingPaper}
					{confirm}

                    <p className='powered'>
                        <img alt='logo' className='logo' src={logo} />
                        <FormattedMessage
                            id='app.powered'
                            defaultMessage='Powered by '
                        />
                        <a href='http://www.vige.it'>Vige</a>
                    </p>
                </div>
                {config && config.votingPapers.map((votingPaper) => {
                        let confirmedHeader =
                            <FormattedMessage id='app.confirm.confirmedheader'
                                defaultMessage='Your vote was sent!'>
                            </FormattedMessage>
                        let confirmedBody =
                            <FormattedMessage id='app.confirm.confirmedbody'
                                defaultMessage='Your vote has been sent successfully. The results will be shown shortly. We thank you for your participation'>
                            </FormattedMessage>
						let header = <header key={'header-' + votingPaper.id} className={'App-header '+votingPaper.type} ref={'header-' + votingPaper.id} style={ votingPaper.name !== this.state.activeItem['label'] ? { display: 'none' } : {backgroundImage: `url(${background})`, backgroundColor: '#'+votingPaper.color, borderColor: '#'+votingPaper.color}}>
                            	<VotingPaper config={votingPaper} visible={this.state.visible} ref={'votingpaper-'+votingPaper.id} />
                                <Panel header={confirmedHeader} style={!this.state.visible ? {} : {display: 'none'}}>
                                    {confirmedBody}
                                </Panel>
                        </header>
                        return (header)
                        })
			    }
            </div>
        )
    }
}

export default App