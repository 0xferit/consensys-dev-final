import React, { Component } from 'react'
import { setJSON, getJSON } from './util/IPFS.js'
import { Col, Form, Button, FormControl } from 'react-bootstrap';
import Loader from "./Loader"
import { timestamp, getTimestamp, getHash, getTags, getIds } from './services/ProofOfExistenceService';

export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            myData: "",
            ipfsData: "",
            timestamp: "",
            loading: false
        }
    }
    componentDidMount = async () => {
        this.fetchData()
    }
    handleSubmit = async (e) => {
        console.log("handleSubmit");
        e.preventDefault();
        this.setState({ loading: true });
        const hash = await setJSON({ myData: this.state.myData });
        console.log("hash: " + hash);
        try {
            await timestamp(hash, "", this.props.specificNetworkAddress);
        } catch (error) {
            this.setState({ loading: false });
            alert("There was an error with the transaction.");
            return;
        }
        this.fetchData();
    }
    fetchData = async () => {
        console.log("fetchData");
        //first get hash from smart contract
        console.log(this.props.specificNetworkAddress);
        const ids = await getIds(this.props.specificNetworkAddress, 0);
        const hash0 = await getHash(ids);
        //then get data off IPFS
        const ipfsHash = hash0;
        console.log("hash0: " + hash0);
        if (!ipfsHash) { return }
        const timestamp = await getTimestamp(hash0);
        const details = await getJSON(ipfsHash);
        this.setState({ ipfsData: details, loading: false, timestamp })
    }
    handleMyData = (e) => {
        console.log("handleMyData");
        this.setState({ myData: e.target.value });
    }

    render() {
        return (
            <React.Fragment>
                <Col sm={5} >
                    {this.state.timestamp ?
                        <p>Data loaded from Ethereum / IPFS: <br />Time saved to block: {new Date(Number(this.state.timestamp + "000")).toUTCString()}</p>
                        :
                        <div><h4>No record found for this account.</h4><p>Please enter and submit data on the right</p></div>
                    }
                    <div className="blockchain-display">
                        {this.state.ipfsData.myData}
                    </div>

                </Col>
                <Col sm={4} smOffset={2}>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <h4>Enter Details:</h4>
                        <p>My super tamper proof data:</p>

                        <FormControl componentClass="textarea" type="text" rows="3" placeholder="enter data"
                            value={this.state.myData}
                            onChange={this.handleMyData} />
                        <br />
                        <Button type="submit">Update Details</Button>
                    </Form>
                </Col>
                {this.state.loading &&
                    <Loader />
                }
            </React.Fragment>
        )
    }
}

export default Dashboard
