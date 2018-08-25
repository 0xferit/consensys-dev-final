import React, { Component } from 'react';
import { setJSON, decodeIPFSHash, encodeIPFSHash } from './util/IPFS.js';
import { Col, Row, Form, FormControl } from 'react-bootstrap';
import Dropzone from 'react-dropzone'
import {Loader, SearchLoader} from "./Loader"
import { timestamp, getTimestamp, getHash, getTags, getAllTags, getId, getAllIds, getAllHashes, getStopped, getContractAddress } from './services/ProofOfExistenceService';
import SearchBar from './SearchBar';

export class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            myData: "",
            myTags: "",
            ipfsData: [],
            loading: false,
            searching: false,
            contractStopped: false,
            contractAddress: "Fetching...",
            searchResult: [],
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
            await timestamp(decodeIPFSHash(receipt[0].hash), this.state.myTags, this.props.specificNetworkAddress);
        } catch (error) {
            this.setState({ loading: false });
            alert("There was an error with the transaction.");
            return;
        }
        this.fetchData();
    }



    fetchData = async () => {
        //first get hash from smart contract
        const contractStopped = await getStopped();
        this.setState({contractStopped, contractAddress: await getContractAddress()});
        const ids = await getAllIds(this.props.specificNetworkAddress);
        console.log("IDs: " + ids);
        const hashes = await getAllHashes(ids);
        console.log("hashesssss: " + hashes);
        //then get data off IPFS
        const ipfsHashes = hashes.map(x => encodeIPFSHash(x));
        if (Array.isArray(ipfsHashes) && ipfsHashes.length === 0) {
          console.log("early return");
          return;
       }
        console.log("didn't return early");
        const allTags = await getAllTags(hashes);
        const timestamps = (await Promise.all(hashes.map(async x => getTimestamp(x)))).map(x => x.toNumber());
        console.log("timestamps good?: " + timestamps);

        let allDetails = [];

        for(let i = 0; i < ids.length; i++){
            console.log(ids[i].toNumber());
            console.log(hashes[ids[i]]);
            console.log(ipfsHashes[ids[i]]);
            allDetails.push({id: ids[i].toNumber(), hash: hashes[i], ipfsHash: ipfsHashes[i], tags: allTags[i], timestamp: timestamps[i]});
        }

        console.log("allDetails");
        console.log(allDetails);

        this.setState({ ipfsData: allDetails, loading: false, contractStopped: contractStopped.toString() })
        console.log("fetchData ended");

    }

    fetchDataById = async (id) => {
        if(isNaN(id) || id === ''){
          this.setState({searchResult: []});
          return;
        }
        this.setState({searching: true});

        console.log("Search id is: " + id );

        const hash = await getHash(id);
        if(parseInt(hash, 16) === 0) {
          this.setState({searchResult: [], searching: false});
          return;
        }

        const tags = await getTags(hash);
        const ipfsHash = encodeIPFSHash(hash);
        const timestamp = (await getTimestamp(hash)).toNumber();
        console.log("fetchDataById");
        console.log(timestamp);

        let search = [];
        search.push({id, hash, ipfsHash, tags, timestamp});
        console.log("search");
        console.log(search);

        this.setState({searchResult: search, searching: false});
        console.log("searchResult");
        console.log(this.state.searchResult);
    }


    handleMyData = (e) => {
        this.setState({ myData: e.target.value });
    }


    blockchainDisplay = (payload, flag) => {
      console.log("payload " +flag);
      console.log(payload);
      if(!Array.isArray(payload) || payload.length === 0)
      {
        return (<p id="no-result">No Result</p>);
      }

      const items = payload.map((x) =>
        <tr key={flag+ x.id}>
            <th scope="col">{x.id}</th>
            <th scope="col"><a href={"https://ipfs.io/ipfs/"+ x.ipfsHash} target="_blank">{x.ipfsHash}</a><br/>{x.hash}</th>
            <th scope="col">{x.tags}</th>
            <th scope="col">{new Date(Number(x.timestamp + "000")).toUTCString()}</th>
        </tr>
      );
      return(
          <table key="blockchainDisplay" className="table">
            <thead>
              <tr>
                <th scope="col">Record ID</th>
                <th scope="col">IPFS Hash (Base58 / Decoded)</th>
                <th scope="col">Tags</th>
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
        console.log(this.state.myTags.split(";"));
        try {
            await timestamp(decodeIPFSHash(receipt[0].hash), this.state.myTags, this.props.specificNetworkAddress);
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
                  <SearchBar onSearchTermChange={term => this.fetchDataById(term)}>
                  </SearchBar>
                  <Col sm={12}>
                      {this.blockchainDisplay(this.state.searchResult, "search")}
                  </Col>
                </div>
              </React.Fragment>

              <React.Fragment>
                <Col sm={12} >
                  <div className="status">
                    <p> Network: {this.props.network} </p>
                    <p> Contract: {this.state.contractAddress}</p>
                    <p> Account: {this.props.specificNetworkAddress}</p>
                    <p>Emergency Stop: {this.state.contractStopped.toString()}</p>
                  </div>


                    <br/>
                    {this.state.ipfsData.length !== 0 ?
                        <h4>My Records</h4>
                        :
                        <div><h4>No record found for this account.</h4><p>You can upload a file below.</p></div>
                    }
                    <div>
                      {this.blockchainDisplay(this.state.ipfsData, "myrecords")}
                    </div>

                </Col>
                </React.Fragment>

                <React.Fragment>
                  <div>
                <Row>

                <Col sm={12}>
                  <div >
                    <Dropzone className="drop" onDrop={this.onDrop} multiple={false} onChange={this.handleMyData} >
                      <div className="pad-side">
                        <h4 className="pt-ui-text-large">Drop a file into the box to upload!</h4>
                      </div>
                    </Dropzone>

                  </div>
                </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <Form  id="tags" horizontal>
                        <FormControl componentClass="textarea" type="text" rows="1" placeholder="Optional: Enter tags here.."
                            value={this.state.myTags}
                            onChange={(e) => this.setState({myTags: e.target.value})} />
                    </Form>
                  </Col>

                  {this.state.loading &&
                      <Loader />
                  }
                  {this.state.searching &&
                      <SearchLoader />
                  }
                </Row>
              </div>


              </React.Fragment>


            </div>

        )
    }
}

export default Dashboard
