import React, { Component } from 'react';
import { setJSON, getJSON, decodeIPFSHash, encodeIPFSHash } from './util/IPFS.js';
import { Col, Form, Button, FormControl } from 'react-bootstrap';
import Dropzone from 'react-dropzone'
import Loader from "./Loader"
import web3 from "web3";
import bs58 from "bs58";
import { timestamp, getTimestamp, getHash, getTags, getId, getAllIds, getAllHashes, getStopped, getContractAddress } from './services/ProofOfExistenceService';


export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            myData: "",
            ipfsData: [],
            loading: false,
            contractStopped: false,
            contractAddress: "Fetching..."
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
        console.log("network: " + this.props.network);
        console.log("contract address: " + await getContractAddress());
        //first get hash from smart contract
        const contractStopped = await getStopped();
        console.log(contractStopped);
        this.setState({contractStopped, contractAddress: await  getContractAddress()});
        console.log("address: " + this.props.specificNetworkAddress);
        const ids = await getAllIds(this.props.specificNetworkAddress);
        console.log("ids: " + ids);
        const hashes = await getAllHashes(this.props.specificNetworkAddress);
        console.log("hashes: " + hashes);
        //then get data off IPFS
        const ipfsHashes = hashes.map(x => encodeIPFSHash(x));
        console.log(ipfsHashes);
        if (Array.isArray(ipfsHashes) && ipfsHashes.length === 0) { return }
        const timestamps = (await Promise.all(hashes.map(async x => getTimestamp(x)))).map(x => x.toNumber());
        console.log(timestamps);
        const multipleDetails = (await Promise.all(ipfsHashes.map(async x => getJSON(x))));

        console.log(multipleDetails);

        let allDetails = [];

        for(const id of ids){
            allDetails.push({id: id.toNumber(), hash: hashes[id], ipfsHash: ipfsHashes[id], timestamp: timestamps[id], data: multipleDetails[id].myData});
        }
        console.log(allDetails);

        this.setState({ ipfsData: allDetails, loading: false, contractStopped: contractStopped.toString() })
        console.log("fetchData ended");

    }
    handleMyData = (e) => {
        console.log("handleMyData: " + e.target.value);
        this.setState({ myData: e.target.value });
        console.log(this.state.ipfsData);
    }

    ipfsItems = () => {
        return this.state.ipfsData.map((x) =>
          <tr key="{x.id}">
              <th scope="col">{x.id}</th>
              <th scope="col">{x.hash}<br/>{x.ipfsHash}</th>
              <th scope="col">{x.data}</th>
              <th scope="col">{new Date(Number(x.timestamp + "000")).toUTCString()}</th>
          </tr>
        );
    }




    render() {
        return (
            <React.Fragment>
                <Col sm={12} >
                    <p> Network: {this.props.network} </p>
                    <p> Contract: {this.state.contractAddress}</p>
                    <p> Account: {this.props.specificNetworkAddress}</p>
                    <br/>
                    {this.state.ipfsData.length !== 0 ?
                        <p>Data loaded from IPFS  </p>
                        :
                        <div><h4>No record found for this account.</h4><p>Please enter and submit data on the right</p></div>
                    }
                    <div className="blockchain-display">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Hash (Contract / IPFS)</th>
                            <th scope="col">Data</th>
                            <th scope="col">Timestamp</th>
                          </tr>
                        </thead>
                      <tbody>
                        {this.ipfsItems()}

                      </tbody>
                      </table>


                    </div>

                </Col>

                <div className="row">
                <Col sm={12}>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <p><h4>Emergency Stop: {this.state.contractStopped.toString()}</h4></p>
                        <br/>
                        <h4>Add New Proof</h4>

                        <FormControl componentClass="textarea" type="text" rows="3" placeholder="Enter text here.."
                            value={this.state.myData}
                            onChange={this.handleMyData} />
                        <br />
                        <Button disabled={this.state.contractStopped} type="submit">Timestamp!</Button>
                    </Form>
                </Col>

              </div>
              {this.state.loading &&
                  <Loader />
              }


            </React.Fragment>
        )
    }
}

export default Dashboard
