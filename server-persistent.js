const express = require("express");
const app = express();
const AWS = require("aws-sdk");
AWS.config.update({ region: 'eu-west-1' });
const https = require('https');
const environment = "uat";

const scanParams = {
    TableName: `${environment}-partners`,
};

const globalAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
    maxSockets: 50,
    rejectUnauthorized: true,
});

AWS.config.update({
    httpOptions: {
        agent: globalAgent
    },
    logger: console
});


const client = new AWS.DynamoDB.DocumentClient({
    httpOptions: {
        agent: globalAgent
    }
});

app.get("/", (req, res) => {

    client.scan(scanParams)
        .promise()
        .then(result => result.Items)
        .then(result => {
            res.json(result);
        });



});

app.listen(3000, () => { console.log("listening on port 3000") });