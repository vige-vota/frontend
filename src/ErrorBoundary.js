import React from 'react'
import { FormattedMessage } from 'react-intl'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  
  render() {
      // Error path
	  return (
        <div className='error-boundary'>
          <h2><FormattedMessage
          		id='app.error'
          		defaultMessage='Something went wrong.' />
          </h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.props.error && this.props.error.toString()}
            <br />
            {this.props.errorInfo.componentStack}
          </details>
        </div>
      )
  }  
}

export default ErrorBoundary