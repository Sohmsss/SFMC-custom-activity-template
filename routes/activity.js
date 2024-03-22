'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const moment = require('moment'); 

var util = require('util');
let axios = require("axios");

// Global Variables
const tokenURL = `${process.env.authenticationUrl}/v2/token`;


exports.logExecuteData = [];
function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.execute = function (req, res) {
    JWT(req.body, process.env.jwtSecret, async (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            const args = decoded.inArguments[0];
            const userExtID = args.user_ext_id;
            const lastSearchLocationName = args.last_search_location_name; // Corrected typo here
            const lastSearchStay = args.last_search_stay_datetime;
            const lastSearchDepart = args.last_search_depart_datetime;
            const agent = 'WJ379'

            const hapiFromDate = moment(lastSearchStay).format("YYYY-MM-DD HH:mm");
            const hapiToDate = moment(lastSearchDepart).format("YYYY-MM-DD HH:mm");

            let hapiAirport = '';

            switch (lastSearchLocationName) {
                case 'Heathrow':
                    hapiAirport = 'LHR';
                    break
                case 'Gatwick':
                    hapiAirport = 'LGW';
                    break
                case 'Manchester':
                    hapiAirport = 'MAN';
                    break
                case 'Stansted':
                    hapiAirport = 'STN';
                    break
                case 'Luton':
                    hapiAirport = 'LTN';
                    break
                case 'Birmingham':
                    hapiAirport = 'BHX';
                    break
                case 'Bristol':
                    hapiAirport = 'BRS';
                    break
                case 'Edinburgh':
                    hapiAirport = 'EDI';
                    break
                case 'Glasgow':
                    hapiAirport = 'GLA';
                    break
                case 'Liverpool':
                    hapiAirport = 'LPL';
                    break
                case 'Leeds Bradford':
                    hapiAirport = 'LBA';
                    break
                case 'Newcastle':
                    hapiAirport = 'NCL';
                    break
                case 'Southampton':
                    hapiAirport = 'SOU';
                    break
                case 'Cardiff':
                    hapiAirport = 'CWL';
                    break
                case 'East Midlands':
                    hapiAirport = 'EMA';
                    break
                case 'Belfast International':
                    hapiAirport = 'BFS';
                    break
                case 'Belfast City':
                    hapiAirport = 'BHD';
            }


            const availabilityUrl = `https://hapi.holidayextras.co.uk/carparks?token=fb9e8f70-b38e-4c43-88a6-c08a6c7b4813&sid=12345&location=${hapiAirport}&from=${hapiFromDate}&to=${hapiToDate}&agent=${agent}`;

            try {
                const availabilityResponse = await axios.get(availabilityUrl);
  

                const availableProducts = availabilityResponse.data.products || [];

                const isAvailable = availableProducts.length > 0;

                res.status(200).json({
                    branchResult: isAvailable ? 'available' : 'notAvailable'
                });

            } catch (availabilityError) {
                console.error('Error calling the availability API:', availabilityError);
                res.status(500).end();
            }

        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }
    });
};
/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {
        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            console.log('##### decoded ####=>', decoded);
            res.send(200, 'Execute');
        } else {
            console.error('inArguments invalid.');
            return res.status(400).end();
        }

    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    //console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};


/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};


/*
 * POST Handler for /Stop/ route of Activity.
 */
exports.stop = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Stop');
};


/**
 * This function relies on the env variables to be set
 * 
 * This function invokes the enhanced package authentication. 
 * This would return a access token that can be used to call additional Marketing Cloud APIs
 * 
 */
function retrieveToken () {
    axios.post(tokenURL, { // Retrieving of token
        grant_type: 'client_credentials',
        client_id: process.env.clientId,
        client_secret: process.env.clientSecret
    })
    .then(function (response) {
        return response.data['access_token'];
    }).catch(function (error) {
        return error;
    });
}