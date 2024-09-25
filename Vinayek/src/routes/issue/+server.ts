import {
	AppWallet,
	BlockfrostProvider,
	ForgeScript,
	MeshWallet,
	Transaction,
	type AssetMetadata,
	type Mint
} from '@meshsdk/core';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const { recipients, metadata, assetName } = (await request.json()) as {
		recipients: string[];
		metadata: Record<string, string>;
		assetName: string;
	};

	console.log(metadata)

	const blockchainProvider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY ?? '');

	const wallet = new MeshWallet({
		networkId: 0,
		fetcher: blockchainProvider,
		submitter: blockchainProvider,
		key: {
			type: 'mnemonic',
			words:
				process.env.MNEMONIC?.split(' ') ?? []
		}
	});

	const address = wallet.addresses.baseAddressBech32;

	const forgingScript = ForgeScript.withOneSignature(address ?? '');

	const tx = new Transaction({ initiator: wallet });
	for (const recipient of recipients) {
		console.log(recipient)
		const recipientAddress = recipient;
		const assetMetadata: AssetMetadata = metadata;
		const asset: Mint = {
			assetName: assetName,
			assetQuantity: '1',
			metadata: assetMetadata,
			label: '721',
			recipient: recipientAddress
		};
		tx.mintAsset(forgingScript, asset);
	}

	const unsignedTx = await tx.build();
	const signedTx = await wallet.signTx(unsignedTx, false);
	const txHash = await wallet.submitTx(signedTx);

	return json({ txHash }, { status: 200 });
}
