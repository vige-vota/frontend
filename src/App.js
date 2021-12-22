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
import {Panel} from 'primereact/panel';
import {getTabs, createTabs, colorTabs, removeTab, getVotingPaperById, addToList, isValid, updateSelections} from './Utilities'
import SockJsClient from './SockJsClient'
import UserService from './services/UserService'
import {ProgressSpinner} from 'primereact/progressspinner'

export var config
var appContainer

class App extends Component {

    constructor() {
       super()
       this.state = {
          items: [
          ],
          visible: true
       }
       appContainer = this
 	   this.modalVotingPaper = React.createRef();
 	   this.confirm = React.createRef();
       
   	   UserService.getProfile().then(function(profile) {
       		UserService.axiosInstance.get(process.env.REACT_APP_VOTING_PAPERS_URL)
        	.then(function(response) {
        		config = response.data
        		config.profile = profile
        		createTabs(appContainer)
	    		})
			.catch(function(error) {
				console.log(error)
			});
		}).catch(function() {
        	console.log('Failed to load user profile');
    	});
    }

	componentDidUpdate() {
		if (this.state.operation === 'websocket') {
			colorTabs(this)
			this.setState({operation: undefined})
		}
	}

    render() {
		let confirmComponent = <ConfirmVote ref={this.confirm} window={this}/>
		let modalVotingPaperComponent = ''
		let ruler = ''
		let realTimeVotes = <SockJsClient url={process.env.REACT_APP_VOTING_PAPERS_REALTIME_URL} topics={['/topic/votingpaper']}
						onMessage={(msg) => {
							if (msg.state !== config.state)
								window.location.reload()
							else {
								UserService.getProfile().then(function(profile) {
        							config.profile = profile
								}).catch(function() {
        							console.log('Failed to load user profile');
    							});
								msg.votingPapers = msg.votingPapers.filter(votingPaper => isValid(votingPaper, msg))
								if (msg.state === config.state) {
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
												currentVotingPaper.startingDate = votingPaper.startingDate
												currentVotingPaper.endingDate = votingPaper.endingDate
												currentVotingPaper.disjointed = votingPaper.disjointed
												currentVotingPaper.color = votingPaper.color
												currentVotingPaper.maxCandidates = votingPaper.maxCandidates
												currentVotingPaper.zone = votingPaper.zone
												currentVotingPaper.name = votingPaper.name
												updateSelections(votingPaper, currentVotingPaper)
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
								}
								config.state = msg.state
								this.setState({operation: 'websocket'})
							}
					 }} />
		if (config && config.state === 'PREPARE') {
			confirmComponent = <ConfirmCreate ref={this.confirm} window={this}/>
			modalVotingPaperComponent = <ModalVotingPaper ref={this.modalVotingPaper} />
			ruler = <Ruler ref='ruler' />
		}
		if (!config)
			return (<ProgressSpinner/>)
        else return (
            <div className='App'>
            	{realTimeVotes}
                <div className='content-section implementation'>
                    <Validator ref='validator' />
					{ruler}
                    <TabMenu ref='tabMenu' className={this.state.visible ? '' : 'disabled'}  model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => {
                    	if (config.state === 'PREPARE' && e.originalEvent.target.className.startsWith('p-menuitem-icon')) {
							let currentVotingPaper = getVotingPaperById(e.value)
							this.modalVotingPaper.current.setState({
								votingPaper: e,
								app: this,
								operation: 'update',
								startingDate: new Date(currentVotingPaper.startingDate),
								endingDate: new Date(currentVotingPaper.endingDate),
								disjointed: currentVotingPaper.disjointed,
								maxCandidates: currentVotingPaper.maxCandidates,
								zone: currentVotingPaper.zone,
								color: currentVotingPaper.color,
								type: currentVotingPaper.type
							})
							this.modalVotingPaper.current.open()
						} else if (this.state.visible) {
                            if (e.value.label === this.state.confirmButtonLabel)
                                this.confirm.current.open()
                            else {
								if (e.value.label === '+') {
									this.modalVotingPaper.current.setState({
										votingPaper: '',
										app: this,
										operation: 'insert',
										disjointed: false,
										maxCandidates: 0,
										zone: 0,
										color: '1976D2',
										type: 'bigger'
									})
                                	this.modalVotingPaper.current.open()
                             	} else 
                                	this.setState({ activeItem: e.value })
							}
						}
                    }
                    } />

					{modalVotingPaperComponent}
					{confirmComponent}
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