

const AWS = require("aws-sdk");
AWS.config.update({ region: 'eu-west-1' });
const https = require('https');

const environment = "prod";

const scanParams = {
    TableName: `${environment}-partners`,
};

const globalAgent = new https.Agent({
    keepAlive: true,
    // keepAliveMsecs: 5000,
    // maxSockets: 50,
    // rejectUnauthorized: true,
});

AWS.config.update({
    httpOptions: {
        agent: globalAgent
    },
    logger: console
});

const scanPartners = client => client.scan(scanParams).promise().then(result => result.Items);

const scanPartnerWithTiming = async client => {

    const before = (new Date()).getTime();

    await scanPartners(client);

    const after = (new Date()).getTime();

    return after - before;

}

const scanNTimes = (n, client) => {

    let promises = [];

    for (let i = 0; i < n; i++) {

        promises.push(scanPartnerWithTiming(client));

    }

    return Promise.all(promises).then(results => results.reduce((sum, curr) => sum + curr));

}

async function testForNoKeepAlive(n) {

    const client = new AWS.DynamoDB.DocumentClient();

    const aggregate = await scanNTimes(n, client);

    return aggregate;

}


async function testForKeepAlive(n) {

    console.log("With");

    const client = new AWS.DynamoDB.DocumentClient({

    });

    const aggregate = await scanNTimes(n, client);

    return aggregate;

}

async function main() {

    console.log("Keep Alive");
    console.log(await testForKeepAlive(5));

    console.log("No Keep Alive");
    console.log(await testForNoKeepAlive(5));

}

main();