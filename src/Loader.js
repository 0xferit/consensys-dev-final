import React from 'react';

const Loader = () => {
    return (
        <div className="outerLoader">
            <div className="loader"></div>
            <h4>Please approve the transaction on the uPort app on your mobile phone. <br />Waiting for transaction confirmation...</h4>
        </div>
    );
};

export default Loader;
