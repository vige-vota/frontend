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
import {getTabs, colorTabs, getVotingPaperById} from './Utilities'
import SockJsClient from './SockJsClient'

export var config

class App extends Component {

    constructor(data) {
        super(data)
        config = data.config
        this.state = {
            items: [
            ],
            activeItem: { id: config.votingPapers[0].id, label: config.votingPapers[0].name },
            visible: true
        }
        config.votingPapers.map((votingPaper) => {
			if (config.admin)
            	return this.state.items.push({ id: votingPaper.id, label: votingPaper.name, icon: 'pi pi-fw pi-briefcase' })
			else 
				return this.state.items.push({ id: votingPaper.id, label: votingPaper.name })
        })
        this.state.confirmButtonLabel = <FormattedMessage
            id='app.confirm'
            defaultMessage='Confirm'
        />
		if (config.admin)
			 this.state.items.push({ label: '+' })
        this.state.items.push({ label: this.state.confirmButtonLabel })
    }

    componentDidMount() {
		const tabs = colorTabs(this)
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
		if (config.admin) {
			confirm = <ConfirmCreate ref='confirm' window={this}/>
			modalVotingPaper = <ModalVotingPaper ref='modalVotingPaper' />
			ruler = <Ruler ref='ruler' />
			realTimeVotes = <SockJsClient url={process.env.REACT_APP_VOTING_PAPERS_REALTIME_URL} topics={['/topic/votingpaper']}
						onMessage={(msg) => {
							msg.votingPapers.forEach((votingPaper, i) => {
								let currentItem = this.state.items[i]
								if (currentItem) {
									currentItem.id = votingPaper.id
									currentItem.label = votingPaper.name
								}
								let currentVotingPaper = config.votingPapers[i]
								if (currentVotingPaper) {
									currentVotingPaper.type = votingPaper.type
									currentVotingPaper.disjointed = votingPaper.disjointed
									currentVotingPaper.color = votingPaper.color
									currentVotingPaper.maxCandidates = votingPaper.maxCandidates
									currentVotingPaper.id = votingPaper.id
									currentVotingPaper.name = votingPaper.name
									currentVotingPaper.groups = votingPaper.groups
									currentVotingPaper.parties = votingPaper.parties
								}
							})
							const tabs = getTabs(this)
							let index = this.state.items.map((e) => e.id).indexOf(this.state.activeItem.id)
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
                {config.votingPapers.map((votingPaper) => {
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