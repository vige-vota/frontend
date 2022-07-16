import React from 'react'
import {FileUpload} from 'primereact/fileupload';
import {ObjectUtils} from 'primereact/utils';
import {Button} from 'primereact/button';
import {base64ToFile} from '../Utilities'
	
export class CandidateUpload extends React.Component {
	
	onFileSelect(event) {
		super.onFileSelect(event)
		if (this.state.files.length > 1)
			this.state.files.shift()
	}
	
	remove(index) {
		super.remove(index)
		this.props.party.setState({ image: '' })
	}
	
	renderFile(file, index) {
        var _this5 = this;

        var preview = this.isImage(file) ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
          alt: file.name,
          role: "presentation",
          src: file.objectURL,
          width: this.props.previewWidth
        })) : null;
        var fileName = /*#__PURE__*/React.createElement("div", {
          className: "p-fileupload-filename"
        }, file.name);
        var size = /*#__PURE__*/React.createElement("div", null, this.formatSize(file.size));
        var removeButton = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
          type: "button",
          icon: "pi pi-times",
          disabled: this.props.disabled,
          onClick: function onClick(e) {
            return _this5.remove(e, index);
          }
        }));
        var content = /*#__PURE__*/React.createElement(React.Fragment, null, preview, fileName, size, removeButton);

        if (this.props.itemTemplate) {
          var defaultContentOptions = {
            onRemove: function onRemove(event) {
              return _this5.remove(event, index);
            },
            previewElement: preview,
            fileNameElement: fileName,
            sizeElement: size,
            removeElement: removeButton,
            formatSize: this.formatSize(file.size),
            element: content,
            props: this.props
          };
          content = ObjectUtils.getJSXElement(this.props.itemTemplate, file, defaultContentOptions);
        }

        return /*#__PURE__*/React.createElement("div", {
          className: "p-fileupload-row",
          key: file.name + file.type + file.size
        }, content);
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
	
	render() {
    	return (
     		<FileUpload />
    	)
  	}
}