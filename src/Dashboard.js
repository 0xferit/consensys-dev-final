import _ from 'lodash';
import React, { Component } from 'react';
import { setJSON, getJSON, decodeIPFSHash, encodeIPFSHash } from './util/IPFS.js';
import { Col, Row, Form, Button, FormControl } from 'react-bootstrap';
import Dropzone from 'react-dropzone'
import Loader from "./Loader"
import web3 from "web3";
import { timestamp, getTimestamp, getHash, getTags, getId, getAllIds, getAllHashes, getStopped, getContractAddress } from './services/ProofOfExistenceService';
import SearchBar from './SearchBar';

export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            myData: "",
            ipfsData: [],
            loading: false,
            contractStopped: false,
            contractAddress: "Fetching...",
            searchResult: [],
            counter: 1
        }
    }

    componentDidMount = async () => {
        this.fetchData()
    }



    handleSubmit = async (e) => {
        console.log("handleSubmit");
        e.preventDefault();
        this.setState({ loading: true });
        let receipt = await setJSON({path: '', content: Buffer.from(this.state.myData)});
        console.log("receipt " + receipt);

        try {
            await timestamp(decodeIPFSHash(receipt[0].hash), "", this.props.specificNetworkAddress);
        } catch (error) {
            this.setState({ loading: false });
            alert("There was an error with the transaction.");
            return;
        }
        this.fetchData();
    }

    delayedSearch = _.debounce((term) => {this.fetchDataById(term)}, 0);

    fetchData = async () => {
        //first get hash from smart contract
        const contractStopped = await getStopped();
        this.setState({contractStopped, contractAddress: await  getContractAddress()});
        const ids = await getAllIds(this.props.specificNetworkAddress);
        const hashes = await getAllHashes(this.props.specificNetworkAddress);
        //then get data off IPFS
        const ipfsHashes = hashes.map(x => encodeIPFSHash(x));
        if (Array.isArray(ipfsHashes) && ipfsHashes.length === 0) { return }
        const timestamps = (await Promise.all(hashes.map(async x => getTimestamp(x)))).map(x => x.toNumber());
        const multipleDetails = (await Promise.all(ipfsHashes.map(async x => getJSON(x))));


        let allDetails = [];

        for(const id of ids){
            allDetails.push({id: id.toNumber(), hash: hashes[id], ipfsHash: ipfsHashes[id], timestamp: timestamps[id], data: multipleDetails[id].myData});
        }

        this.setState({ ipfsData: allDetails, loading: false, contractStopped: contractStopped.toString() })
        console.log("fetchData ended");

    }

    fetchDataById = async (id) => {
        if(isNaN(id) || id === ''){
          this.setState({searchResult: []});
          return;
        }

        console.log("Search id is: " + id );

        const hash = await getHash(id);
        if(parseInt(hash, 16) === 0) {
          this.setState({searchResult: []});
          return;
        }

        const ipfsHash = encodeIPFSHash(hash);
        const timestamp = (await getTimestamp(hash)).toNumber();
        const data = await getJSON(ipfsHash);
        console.log("fetchDataById");
        console.log(timestamp);

        let search = [];
        search.push({id, hash, ipfsHash, timestamp, data: data.myData});
        console.log("search");
        console.log(search);

        this.setState({searchResult: search});
        console.log("searchResult");
        console.log(this.state.searchResult);
    }


    handleMyData = (e) => {
        this.setState({ myData: e.target.value });
    }

    getRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max));
    }

    blockchainDisplay = (payload, flag) => {
      console.log("payload " +flag);
      console.log(payload);
      if(!Array.isArray(payload) || payload.length === 0)
      {
        return (<h4>No Result</h4>);
      }

      const items = payload.map((x) =>
        <tr key={x.id}>
            <th scope="col">{x.id}</th>
            <th scope="col"><a href={"https://ipfs.io/ipfs/"+ x.ipfsHash} target="_blank">{x.ipfsHash}</a><br/>{x.hash}</th>
            <th scope="col">{new Date(Number(x.timestamp + "000")).toUTCString()}</th>
        </tr>
      );
      return(
          <table key={this.getRandomInt(100000)} className="table">
            <thead>
              <tr>
                <th scope="col">Record ID</th>
                <th scope="col">IPFS Hash (Plaintext / Encoded)</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      )
    }

    onDrop = async (acceptedFiles, rejectedFiles) => {
      var reader = new FileReader();
      reader.readAsArrayBuffer(acceptedFiles[0]);
      this.setState({ loading: true });
      reader.addEventListener("loadend", async () => {
        console.log("reader");
        console.log(reader.result);
        const buffer = Buffer.from(reader.result);
        const receipt = (await setJSON(buffer));
        console.log(receipt);
        try {
            await timestamp(decodeIPFSHash(receipt[0].hash), "", this.props.specificNetworkAddress);
        } catch (error) {
            this.setState({ loading: false });
            alert("There was an error with the transaction.");
            console.log(error);
            return;
        }
        this.fetchData();
      })
    }

    render() {
        return (
            <div>
              <React.Fragment>
                <div className="search">
                  <SearchBar onSearchTermChange={term => this.delayedSearch(term)}>
                  </SearchBar>
                  <Col sm={12}>
                    {this.blockchainDisplay(this.state.searchResult)}
                  </Col>
                </div>
              </React.Fragment>

              <React.Fragment>
                <Col sm={12} >
                  <div className="status">
                    <h4>Status</h4>
                    <p> Network: {this.props.network} </p>
                    <p> Contract: {this.state.contractAddress}</p>
                    <p> Account: {this.props.specificNetworkAddress}</p>
                    <p>Emergency Stop: {this.state.contractStopped.toString()}</p>
                  </div>


                    <br/>
                    {this.state.ipfsData.length !== 0 ?
                        <h4>My Records</h4>
                        :
                        <div><h4>No record found for this account.</h4><p>Please enter and submit data on the right</p></div>
                    }
                    <div className="blockchain-display">
                      {this.blockchainDisplay(this.state.ipfsData, 0)}
                    </div>

                </Col>
                </React.Fragment>

                <React.Fragment>
                <Col sm={6}>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <br/>
                        <br/>
                        <h4>Add New Proof To The Notary</h4>

                        <FormControl componentClass="textarea" type="text" rows="3" placeholder="Enter text here.."
                            value={this.state.myData}
                            onChange={this.handleMyData} />
                        <br />
                        <Button type="submit">Notarize</Button>
                    </Form>
                    <div className="pt-card col-md-6">
                      <Dropzone className="drop" onDrop={this.onDrop} multiple={false}>
                        <div className="pad-side">
                          <h4 className="pt-ui-text-large">Drop a file into the box to get started!</h4>
                          <h4 className="pt-ui-text-large">The file will NOT be uploaded. The cryptographic proof is calculated client-side</h4>
                        </div>
                      </Dropzone>
                    </div>
                </Col>
                {this.state.loading &&
                    <Loader />
                }

              </React.Fragment>
            </div>

        )
    }
}

export default Dashboard
