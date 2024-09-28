# @relink-cardano/core

A TypeScript library for creating and redeeming asset links on the Cardano blockchain using the Lucid library.

## Installation

You can install the `@relink-cardano/core` package via npm:

```bash
npm install @relink-cardano/core
```
Or using yarn

```bash
yarn add @relink-cardano/core
```

### Usage

#### Creating an asset link
First, import the Relink class from the package:
```ts
import { Relink, RelinkConfig } from "@relink-cardano/core";
import { Lucid, Blockfrost, Network } from "lucid-cardano";
```
Create a new instance of Relink by providing the necessary configuration:

```ts
const config: RelinkConfig = {
  baseUrl: "https://your-base-url.com",
  blockfrostId: "your-blockfrost-project-id",
  blockFrostUrl: "https://cardano-mainnet.blockfrost.io/api/v0",
  network: Network.Mainnet, // or Network.Testnet
  walletApi: yourWalletApi, // Replace with your wallet API
};

const relink = await Relink.new(config);

```
Use the ```depositAndGenerateLink``` method to create a deposit link. This link can be shared with users to allow them to deposit assets.
```ts
const amount = 1000; // Amount of the asset to deposit
const assetId = "your-asset-id";
const ownerAddress = "addr1..."; // Owner's Cardano address

const depositLink = await relink.depositAndGenerateLink({
  owner: ownerAddress,
  amount,
  assetId,
});

console.log("Deposit Link:", depositLink.toString());

```


#### Redeeming an asset link
To redeem an asset link, you need the transaction hash, private key, and output index from the link generated at ```depositAndGenerateLink```. Use the ```redeemAssetAndSubmit``` method to redeem the asset and submit the transaction to the blockchain.
```ts
const txHash = "your-tx-hash";
const privateKey = "your-private-key";
const outputIndex = 0; // The output index from the link

const signedTransaction = await relink.redeemAssetAndSubmit({
  txHash,
  key: privateKey,
  outputIndex,
});

console.log("Signed Transaction Submitted:", signedTransaction);


```
