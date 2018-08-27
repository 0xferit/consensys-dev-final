import React, { Component } from 'react';
import Dashboard from './Dashboard';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { initAccount } from "./util/Uport";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { userName: "", avatar: "", specificNetworkAddress: "", network: "" }
  }

  handleLogin = async (e) => {
    e.preventDefault();
    let identity = await initAccount();
    this.setState({
      specificNetworkAddress: identity.specificNetworkAddress,
      userName: identity.user.name,
      avatar: identity.user.avatar && identity.user.avatar.uri,
      network: identity.network
    })

    console.log("network: " + this.state.network);
  }

  handleLogout = async (e) => {
    e.preventDefault();
    this.setState({ userName: "", avatar: "", specificNetworkAddress: "", network: "" })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Proof of Existence with IPFS and uPort</h1>
          <h1 className="App-title">Ferit Tunçer</h1>
          {this.state.userName &&
            <React.Fragment>
              <div className="avatar">
                <div>
                  <p>{this.state.userName}</p>
                  <a href="" onClick={this.handleLogout} className="logout">Logout</a>
                </div>
                {this.state.avatar && <img src={this.state.avatar} alt="avatar" />}
              </div>
            </React.Fragment>
          }
        </header>

        <Grid>
          <Row className="grid-row">
            {this.state.userName.length !== 0 ? (
              <Dashboard specificNetworkAddress={this.state.specificNetworkAddress} network={this.state.network}/>
            ) : (
                <Col sm={6} smOffset={3} className="login">
                  <p className="text-large">This app uses uPort for login and transaction approvals.
                      Download the uPort app on your mobile phone to begin.
                      <a href="https://www.uport.me/" rel="noopener noreferrer" target="_blank"> https://www.uport.me/</a>
                  </p>
                  <Button onClick={this.handleLogin}>Login with uPort</Button>
                </Col >
              )}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
