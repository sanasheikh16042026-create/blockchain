const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// ----------------------
// Express App
// ----------------------
const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// ----------------------
// Test Endpoint
// ----------------------
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working ✔" });
});

// ----------------------
// Load Connection Profile
// ----------------------
const ccpPath = path.resolve(__dirname, 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// ----------------------
// Connect to Contract
// ----------------------
async function getContract() {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check identity
    const identity = await wallet.get('admin');
    if (!identity) {
        throw new Error("❌ Admin identity not found in wallet! Expected at: " + walletPath);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: false }   // IMPORTANT for Codespaces
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    return { contract, gateway };
}

// ----------------------
// Create Car
// ----------------------
app.post('/api/createCar', async (req, res) => {
    try {
        const { id, make, model, color, owner } = req.body;
        const { contract, gateway } = await getContract();

        await contract.submitTransaction('createCar', id, make, model, color, owner);
        await gateway.disconnect();

        res.json({ success: true, message: "Car created!" });
    } catch (error) {
        console.error("❌ ERROR /api/createCar:", error);
        res.status(500).send(error.toString());
    }
});

// ----------------------
// Query Car
// ----------------------
app.get('/api/queryCar/:id', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryCar', req.params.id);
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        console.error("❌ ERROR /api/queryCar:", error);
        res.status(500).send(error.toString());
    }
});

// ----------------------
// Query All Cars
// ----------------------
app.get('/api/queryAllCars', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('queryAllCars');
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        console.error("❌ ERROR /api/queryAllCars:", error);
        res.status(500).send(error.toString());
    }
});

// ----------------------
// Start Server
// ----------------------
app.listen(5000, () => {
    console.log("Backend running on port 5000 ✔");
});
