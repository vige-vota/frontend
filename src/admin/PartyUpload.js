import React from 'react'
import { FormattedMessage } from 'react-intl'
import {FileUpload} from 'primereact/fileupload';
import {base64ToFile} from '../Utilities'
	
export class PartyUpload extends FileUpload {
	
	onFileSelect(event) {
		super.onFileSelect(event)
		if (this.state.files.length > 1)
			this.state.files.shift()
	}
	
	remove(index) {
		super.remove(index)
		this.props.party.setState({ image: '' })
	}
	
	validate(file){
	    if (this.props.maxFileSize && file.size > this.props.maxFileSize) {
	    	let invalidFileSizeMessageSummary = <FormattedMessage
            	id='app.admin.error.file.summary'
                defaultMessage={this.props.invalidFileSizeMessageSummary}
	    		values = {{0: file.name}}
            />
	    	let invalidFileSizeMessageDetail = <FormattedMessage
            	id='app.admin.error.file.detail'
                defaultMessage={this.props.invalidFileSizeMessageDetail}
	    		values = {{0: this.formatSize(this.props.maxFileSize)}}
            />
	        var message = {
	            severity: 'error',
	            summary: invalidFileSizeMessageSummary,
	            detail: invalidFileSizeMessageDetail
	        };

	        if (this.props.mode === 'advanced') {
	            this.messagesUI.show(message);
	        }

	        if (this.props.onValidationFail) {
	            this.props.onValidationFail(file);
	        }

	        return false;
	    }

	    return true;
	} 

	componentDidUpdate() {
		if (this.props.party.state.opened) {
			let party = this.props.party.props.party
			if (party && party.image)
				this.onFileSelect({
					target: {
						files: [
							base64ToFile(party)
						]
					}
				}) 
			else this.state.files.pop()
			this.props.party.setState({ opened: false})
			if (this.props.party.state.operation === 'insert' && 
				!this.props.party.state.image)
				this.state.files.pop()
		}
	}
}