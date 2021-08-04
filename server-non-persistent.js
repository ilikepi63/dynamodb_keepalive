const express = require("express");
const app = express();
const AWS = require("aws-sdk");
AWS.config.update({ region: 'eu-west-1' });

const environment = "uat";

AWS.config.update({
    logger: console
});

const scanParams = {
    TableName: `${environment}-partners`,
};

const client = new AWS.DynamoDB.DocumentClient();

app.get("/", (req, res) => {

    client.scan(scanParams)
        .promise()
        .then(result => result.Items)
        .then(result => {
            res.json(result);
        });

});

app.listen(3001, () => { console.log("listening on port 3001") });