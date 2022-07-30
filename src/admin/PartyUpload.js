import React from 'react'
import { FormattedMessage } from 'react-intl'
import {FileUpload} from 'primereact/fileupload';
import {addImage, base64ToFile} from '../Utilities'

let fileUpload
let files

export class PartyUpload extends React.Component {
	
    onSelect(event) {
		if (event.files[0].objectURL)
        	addImage(event.files[0].objectURL, this.props.party)
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
			files = [
						base64ToFile(party)
					]
			this.props.party.setState({ opened: false})
		}
	}

	componentDidMount() {
		this.show()
	}
	
	componentDidUpdate() {
		this.show()
	}
	
	emptyTemplate() {
		if (files)
			return <>
			<div role='progressbar' className='p-progressbar p-component p-progressbar-determinate' aria-valuemin='0' aria-valuenow='0' aria-valuemax='100'>
      			<div className='p-progressbar-value p-progressbar-value-animate' style={{width: '0%', display: 'block'}}></div>
			</div>
			<div>
    			<div></div>
			</div>
			<div className='p-fileupload-files'>
    			<div className='p-fileupload-row'>
      				<div><img alt='party' role='presentation' src={`data:image/jpeg;base64,${fileUpload.props.parent.state.image}`} width='150' /></div>
      				<div className='p-fileupload-filename'></div>
      				<div>{files[0].size + ' KB'}</div>
      				<div><button type='button' className='p-button p-component p-button-icon-only'><span className='p-button-icon p-c pi pi-times'></span><span className='p-button-label p-c'>&nbsp;</span></button>
      				</div>
    			</div>
			</div>
 			</>
	}
	
	render() {
    	return (
     		fileUpload = <FileUpload accept={this.props.accept} maxFileSize={this.props.maxFileSize} emptyTemplate={this.emptyTemplate}
     		chooseLabel={this.props.chooseLabel} previewWidth={this.props.previewWidth} onSelect={(e) => this.onSelect(e)} parent={this.props.party} />
    	)
  	}
}