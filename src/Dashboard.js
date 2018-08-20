import React, { Component } from 'react';
import { setJSON, getJSON } from './util/IPFS.js';
import { Col, Form, Button, FormControl } from 'react-bootstrap';
import Loader from "./Loader"
import web3 from "web3";
import bs58 from "bs58";
import { timestamp, getTimestamp, getHash, getTags, getId, getAllIds } from './services/ProofOfExistenceService';


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
        let hash = await setJSON({ myData: this.state.myData });
        console.log("hash: " + hash);
        hash = bs58.decode(hash).toString('hex');
        console.log("hash: " + hash);
        hash = "0x" + hash.substr(4);
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
        console.log("address: " + this.props.specificNetworkAddress);
        const ids = await getAllIds(this.props.specificNetworkAddress);
        console.log(ids);
        const id = ids[ids.length -1].toNumber();
        console.log ("id: " + id);
        const hash0 = await getHash(id);
        //then get data off IPFS
        const ipfsHash = hash0;
        console.log("hash0: " + hash0);
        let encoded = "1220" + ipfsHash.substr(2);
        console.log("hash0: " + encoded);
        const bytes = Buffer.from(encoded.toString('hex'), 'hex')
        encoded = bs58.encode(bytes);
        console.log("hash0: " + encoded);
        if (!parseInt(ipfsHash, 16) ) { return } // If hash is zero
        const timestamp = await getTimestamp(hash0);
        const details = await getJSON(encoded);
        this.setState({ ipfsData: details, loading: false, timestamp })
        console.log("fetchData ended");
    }
    handleMyData = (e) => {
        console.log("handleMyData: " + e.target.value);
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
