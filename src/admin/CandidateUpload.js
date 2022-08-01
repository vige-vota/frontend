import React, {createRef} from 'react'
import {FormattedMessage} from 'react-intl'
import {FileUpload} from 'primereact/fileupload';
import {base64ToFile, fileSize} from '../Utilities'
import {Button} from 'primereact/button';
	
let fileUploadz
let files

export class CandidateUpload extends React.Component {

    constructor(data) {
        super(data)
		this.fileUpload = createRef()
		files = []
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
	
	componentDidUpdate() {
		if (this.props.party.state.opened) {
			const selectedCandidate = this.props.candidate
			if (selectedCandidate && selectedCandidate.image)
				files = [
							base64ToFile(selectedCandidate)
					   ]
			else files = []
			if (this.fileUpload.current)
     			this.fileUpload.current.clear()
			this.props.party.setState({ opened: false})
		}
	}
	
	emptyTemplate() {
		console.log(files)
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
      				<div><img alt='candidate' role='presentation' src={`data:image/jpeg;base64,${fileUploadz.props.parent.props.party.state.image}`} width='150' /></div>
      				<div className='p-fileupload-filename'></div>
      				<div>{fileSize(files)}</div>
      				<div><Button className='p-button p-component p-button-icon-only' onClick={(e) => fileUploadz.props.parent.onRemove(e)}><span className='p-button-icon p-c pi pi-times'></span><span className='p-button-label p-c'>&nbsp;</span></Button>
      				</div>
    			</div>
			</div>
 			</>
	}
	
	render() {
     	let invalidFileSizeMessageDetail = <FormattedMessage
            	id= 'app.admin.error.file.detail'
                defaultMessage= 'Maximum dimension is {0}.' />
    	return fileUploadz = <FileUpload ref={this.fileUpload} accept={this.props.accept} maxFileSize={this.props.maxFileSize}
     							chooseLabel={this.props.chooseLabel} previewWidth={this.props.previewWidth} emptyTemplate={this.emptyTemplate}
     							invalidFileSizeMessageSummary='' invalidFileSizeMessageDetail={invalidFileSizeMessageDetail + ''} parent={this} />
  	}
}