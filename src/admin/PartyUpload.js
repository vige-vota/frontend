import React from 'react'
import { FormattedMessage } from 'react-intl'
import {FileUpload} from 'primereact/fileupload';
import {addImage, base64ToFile} from '../Utilities'

let fileUpload

export class PartyUpload extends React.Component {
	
    onSelect(event) {
		if (event.files[0].objectURL)
        	addImage(event.files[0].objectURL, this.props.party)
    }
    
	onFileSelect(files) {
		console.log(fileUpload)
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
	
	show() {
		if (this.props.party.state.opened) {
			let party = this.props.party.props.party
			let files = [
						base64ToFile(party)
					]
			if (party && party.image)
				this.onFileSelect(files) 
			else files.pop()
			this.props.party.setState({ opened: false})
			if (this.props.party.state.operation === 'insert' && 
				!this.props.party.state.image)
				files.pop()
		}
	}

	componentDidMount() {
		this.show()
	}
	
	componentDidUpdate() {
		this.show()
	}
	
	render() {
    	return (
     		fileUpload = <FileUpload accept={this.props.accept} maxFileSize={this.props.maxFileSize} 
     		chooseLabel={this.props.chooseLabel} previewWidth={this.props.previewWidth} onSelect={(e) => this.onSelect(e)} />
    	)
  	}
}