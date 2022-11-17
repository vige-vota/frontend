import React from 'react'
import { FormattedMessage } from 'react-intl'
import {FileUpload} from 'primereact/fileupload';
import {Button} from 'primereact/button';
import {addImage, base64ToFile, fileSize} from '../Utilities'

let fileUpload
let files

export class PartyUpload extends React.Component {
	
    onSelect(event) {
	    files = []
		if (event.files[0].objectURL)
        	addImage(event.files[0].objectURL, this.props.party)
    }
    
    onRemove(event) {
		if (typeof event.stopPropagation !== 'undefined')
			event.stopPropagation()
		if (files && files.length > 0) {
			files.pop()
			this.props.party.setState({ image: ''})
		}
		if (event.file) {
			event.file = null
			this.props.party.setState({ image: ''})
		}
	}
	
	show() {
		if (this.props.party.state.opened) {
			let party = this.props.party.props.party
			if (party.image)
				files = [
						base64ToFile(party)
					]
			else
				files = []
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
		if (files && files.length > 0)
			return <>
			<div role='progressbar' className='p-progressbar p-component p-progressbar-determinate' aria-valuemin='0' aria-valuenow='0' aria-valuemax='100'>
      			<div className='p-progressbar-value p-progressbar-value-animate' style={{width: '0%', display: 'block'}}></div>
			</div>
			<div>
    			<div></div>
			</div>
			<div className='p-fileupload-files'>
    			<div className='p-fileupload-row'>
      				<div><img alt='party' role='presentation' src={`data:image/jpeg;base64,${fileUpload.props.parent.props.party.state.image}`} width='150' /></div>
      				<div className='p-fileupload-filename'></div>
      				<div>{fileSize(files)}</div>
      				<div><Button className='p-button p-component p-button-icon-only' onClick={(e) => fileUpload.props.parent.onRemove(e)}><span className='p-button-icon p-c pi pi-times'></span><span className='p-button-label p-c'>&nbsp;</span></Button>
      				</div>
    			</div>
			</div>
 			</>
	}
	
	render() {
    	return (
     		<FormattedMessage
            	id= 'app.admin.error.file.detail'
                defaultMessage= 'Maximum dimension is {0}.'>
	    					{(invalidFileSizeMessageDetail) => fileUpload = <FileUpload accept={this.props.accept} maxFileSize={this.props.maxFileSize} emptyTemplate={this.emptyTemplate}
     							chooseLabel={this.props.chooseLabel} previewWidth={this.props.previewWidth} onSelect={(e) => this.onSelect(e)} parent={this} 
     							invalidFileSizeMessageSummary='' invalidFileSizeMessageDetail={invalidFileSizeMessageDetail + ''} onRemove={(e) => this.onRemove(e)} />}
	    	</FormattedMessage>
    	)
  	}
}