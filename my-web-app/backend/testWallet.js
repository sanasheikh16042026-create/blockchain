const { Wallets } = require('fabric-network');
const path = require('path');

async function testWallet() {
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));
    const identity = await wallet.get('admin');
    if (!identity) {
        console.log("❌ Admin identity NOT found!");
    } else {
        console.log("✅ Admin identity found:", identity.type);
    }
}
testWallet();
