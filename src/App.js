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
import {colorTabs, getVotingPaperById} from './Utilities'

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

    render() {
		let confirm = <ConfirmVote ref='confirm' window={this}/>
		let modalVotingPaper = ''
		let ruler = ''
		if (config.admin) {
			confirm = <ConfirmCreate ref='confirm' window={this}/>
			modalVotingPaper = <ModalVotingPaper ref='modalVotingPaper' />
			ruler = <Ruler />
		}
        return (
            <div className='App'>
                <div className='content-section implementation'>
                    <Validator />
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
								cssStyle: currentVotingPaper.cssStyle
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
										cssStyle: 'bigger'
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
						let header = <header key={'header-' + votingPaper.id} className={'App-header '+votingPaper.cssStyle} ref={'header-' + votingPaper.id} style={ votingPaper.name !== this.state.activeItem['label'] ? { display: 'none' } : {backgroundImage: `url(${background})`, backgroundColor: '#'+votingPaper.color, borderColor: '#'+votingPaper.color}}>
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