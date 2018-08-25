import React from 'react';

export const Loader = () => {
    return (
        <div className="outerLoader">
            <div className="loader"></div>
            <h4>Please approve the transaction on the uPort app on your mobile phone. <br />Waiting for transaction confirmation...</h4>
        </div>
    );
};

export const SearchLoader = () => {
    return (
        <div className="outerLoader">
            <div className="loader"></div>
            <h4>Searching...</h4>
        </div>
    );
};
