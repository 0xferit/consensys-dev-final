import React, { Component } from 'react';
import { setJSON, getJSON, decodeIPFSHash, encodeIPFSHash } from './util/IPFS.js';
import { Col, Form, Button, FormControl } from 'react-bootstrap';
import Loader from "./Loader"
import web3 from "web3";
import bs58 from "bs58";
import { timestamp, getTimestamp, getHash, getTags, getId, getAllIds, getAllHashes } from './services/ProofOfExistenceService';


export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            myData: "",
            ipfsData: [],
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

        try {
            await timestamp(decodeIPFSHash(hash), "", this.props.specificNetworkAddress);
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
        console.log("ids: " + ids);
        const hashes = await getAllHashes(this.props.specificNetworkAddress);
        console.log("hashes: " + hashes);
        const id = ids[ids.length -1].toNumber();
        console.log ("id: " + id);
        const hash0 = await getHash(id);
        //then get data off IPFS
        const ipfsHash = encodeIPFSHash(hash0);
        const ipfsHashes = hashes.map(x => encodeIPFSHash(x));
        console.log(ipfsHashes);
        if (!ipfsHash) { return } // If hash is zero
        const timestamp = await getTimestamp(hash0);
        const timestamps = (await Promise.all(hashes.map(async x => getTimestamp(x)))).map(x => x.toNumber());
        console.log(timestamps);
        const details = await getJSON(ipfsHash);
        //const multipleDetails = ipfsHashes.map(x => getJSON(x))
        let multipleDetails = [];
        for (let x of ipfsHashes)
        {
            await multipleDetails.push(await getJSON(x));
            console.log(multipleDetails);

        }
        console.log(multipleDetails);

        this.setState({ ipfsData: multipleDetails, loading: false, timestamp })
        console.log("fetchData ended");

    }
    handleMyData = (e) => {
        console.log("handleMyData: " + e.target.value);
        this.setState({ myData: e.target.value });
        console.log(this.state.ipfsData);
    }

    ipfsItems = () => {
        return this.state.ipfsData.map((x) => <div>{x.myData}</div>);
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
                        {this.ipfsItems()}
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
