import {FileUpload} from 'primereact/fileupload';
import {base64ToFile} from '../Utilities'
	
export class CandidateUpload extends FileUpload {
	
	onFileSelect(event) {
		super.onFileSelect(event)
		if (this.state.files.length > 1)
			this.state.files.shift()
	}
	
	remove(index) {
		super.remove(index)
		this.props.party.setState({ image: '' })
	}

	componentDidUpdate() {
		if (this.props.party.state.opened) {
			const selectedCandidate = this.props.candidate
			if (selectedCandidate && selectedCandidate.image)
				this.onFileSelect({
					target: {
						files: [
							base64ToFile(selectedCandidate)
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