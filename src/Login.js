import React, { Component } from 'react';

const Store = window.require('electron-store');
const store = new Store();
const { ipcRenderer } = window.require('electron')

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            integrateWithFeedly: '',
            userId: '',
            authCode: ''
        }

        this.stringToBool = this.stringToBool.bind(this)
        this.handleFeedlyIntegration = this.handleFeedlyIntegration.bind(this)
        this.handleIntegrateWithFeedlyChange = this.handleIntegrateWithFeedlyChange.bind(this)
        this.handleUserIdOnChange = this.handleUserIdOnChange.bind(this)
        this.handleAuthCodeOnChange = this.handleAuthCodeOnChange.bind(this)
    }

    stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      }

    componentDidMount() {
        this.setState({
            integrateWithFeedly: store.get('integrateWithFeedly', false),
            userId: store.get('userId', ''),
            authCode: store.get('authCode', '')
        })
    }

    handleFeedlyIntegration(event) {        
        event.preventDefault()

        let integrateWithFeedly = this.stringToBool(event.target.feedlyIntegration.value)

        store.set('integrateWithFeedly', integrateWithFeedly)

        if(integrateWithFeedly) {
            let userId = event.target.userId.value
            let authorizationCode = event.target.authorizationCode.value

            store.set('userId', userId)
            store.set('authCode', authorizationCode)
        }

        ipcRenderer.send('feedly-integration', 'feedly integration')
    }

    handleIntegrateWithFeedlyChange(event) {
        let val = event.target.value

        this.setState({
            integrateWithFeedly: this.stringToBool(val)
        })

        this.render()
    }

    handleUserIdOnChange(event) {
        this.setState({
            userId: event.target.userId
        })
    }

    handleAuthCodeOnChange(event) {
        this.setState({
            authCode: event.target.authCode
        })
    }

    render() {
        return (
            <div className="row align-items-center full-size" style={{ minHeight: '100vh' }}>
                <div className="col-md-12" style={{ minHeight: '100vh'}}>
                    <div className="card">
                        <div className="bg-login">
                            <header style={{ height: '100vh' }}>
                                <h2 style={{ fontSize: '4em', marginLeft: '15px' }}>
                                    <span>Feedly</span>
                                    <span>Integration</span>
                                </h2>
                                <div className="title">
                                    Login to Feedly
                                </div>
                                <div className="row ml-3 mr-3">
                                    <div className="col-12">
                                        <div className="card-feedly-setting">
                                            <form id="windowSizeSetting" style={{ margin: '15px', padding: '0 0 15px' }} onSubmit={this.handleFeedlyIntegration}>
                                                <div className="form-group">
                                                    <input className="form-check-input" type="radio" name="feedlyIntegration" id="feedlyIntegrationFalse" value="false" checked={this.state.integrateWithFeedly === false} onChange={this.handleIntegrateWithFeedlyChange} />
                                                    <label className="form-check-label" htmlFor="feedlyIntegrationFalse">Don't integrate with Feedly</label>
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-check-input" type="radio" name="feedlyIntegration" id="feedlyIntegrationTrue" value="true" checked={this.state.integrateWithFeedly === true} onChange={this.handleIntegrateWithFeedlyChange} />
                                                    <label className="form-check-label" htmlFor="feedlyIntegrationTrue">Yes, with this credentials:</label>
                                                    <br></br>
                                                    <br></br>
                                                    {this.state.integrateWithFeedly ? 
                                                        <div>
                                                            <label for="userId">User ID</label>
                                                            <input type="text" className="form-control" id="userId" name="userId" onChange={e => this.handleUserIdOnChange(e)} value={this.state.userId}></input>
                                                            <br></br>
                                                            <label for="authorizationCode">Authorization Code</label>
                                                            <textarea rows="5" type="text" className="form-control" id="authorizationCode" name="authorizationCode" onChange={e => this.handleAuthCodeOnChange(e)} value={this.state.authCode}></textarea>
                                                        </div>
                                                        :
                                                        <div>
                                                            <label for="userId">User ID</label>
                                                            <input type="text" className="form-control" id="userId" disabled></input>
                                                            <br></br>
                                                            <label for="authorizationCode">Authorization Code</label>
                                                            <textarea rows="5" type="text" className="form-control" id="authorizationCode" disabled></textarea>
                                                        </div>
                                                    }                                
                                                </div>
                                                <button type="submit" className="btn btn-outline-success float-right"><i className="fas fa-check"></i> Save</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login