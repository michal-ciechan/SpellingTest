import React, { ErrorInfo } from 'react';

export class ErrorBoundary extends React.Component<any, {error?: Error, errorInfo?: ErrorInfo}> {

  // Constructor for initializing Variables etc in a state
  // Just similar to intial line of useState if you are familiar
  // with Functional Components
  constructor(props: any) {
    super(props);
    this.state = { error: undefined, errorInfo: undefined };
  }

  // This method is called if any error is encountered
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {

    // Catch errors in any components below and
    // re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // You can also log error messages to an error
    // reporting service here
  }

  // This will render this component wherever called
  render() {
    if (this.state.errorInfo) {

      // Error path
      return (
        <div>
          <h2>An Error Has Occured</h2>
          <details>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children, i.e. in
    // case no error is Found
    return this.props.children;
  }
}
