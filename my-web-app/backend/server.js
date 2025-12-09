const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load connection profile
const ccpPath = path.resolve(__dirname, 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function getContract() {
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));

    // Identity: admin
    const identity = await wallet.get('admin');
    if (!identity) {
        throw new Error("Admin identity not found in wallet!");
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');   // Change name if using your chaincode

    return { contract, gateway };
}

// API → Create Car
app.post('/createCar', async (req, res) => {
    try {
        const { id, make, model, color, owner } = req.body;

        const { contract, gateway } = await getContract();
        await contract.submitTransaction('createCar', id, make, model, color, owner);
        await gateway.disconnect();

        res.send({ success: true, message: "Car created!" });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// API → Query Car
app.get('/queryCar/:id', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryCar', req.params.id);
        await gateway.disconnect();

        res.send(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// API → Query All Cars
app.get('/queryAllCars', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryAllCars');
        await gateway.disconnect();

        res.send(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
