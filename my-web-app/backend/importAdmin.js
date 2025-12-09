const fs = require("fs");
const path = require("path");
const { Wallets } = require("fabric-network");

async function main() {
    const walletPath = path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const mspPath = path.join(__dirname, "wallet/admin/msp");

    const cert = fs.readFileSync(path.join(mspPath, "signcerts", "cert.pem")).toString();
    const keyFiles = fs.readdirSync(path.join(mspPath, "keystore"));
    const key = fs.readFileSync(path.join(mspPath, "keystore", keyFiles[0])).toString();

    const identity = {
        credentials: {
            certificate: cert,
            privateKey: key,
        },
        mspId: "Org1MSP",
        type: "X.509",
    };

    await wallet.put("admin", identity);

    console.log("✔ Admin identity imported successfully!");
}

main();
