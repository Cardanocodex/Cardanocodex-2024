<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';
	import { Transaction } from '@meshsdk/core';
	import { BrowserWallet } from '@meshsdk/core';
	import type { Wallet } from '@meshsdk/core';
	import { onMount } from 'svelte';
	import { walletStore } from '$lib/store';

	let showWalletList = false;

	let wallet: BrowserWallet | null = null;
	let isConnected: boolean = false;

	let availableWallets: Wallet[] = [];

	onMount(async () => {
		availableWallets = await BrowserWallet.getAvailableWallets();
	});

	function toggleWalletList() {
		showWalletList = !showWalletList;
	}

	async function connectWallet(walletName: string) {
		const id = toast.loading(`Connecting to ${walletName}`);

		const connected = await BrowserWallet.enable(walletName);

		if (connected) {
			toast.success(`${walletName} connected successfully!`);

			wallet = connected;

			walletStore.set(connected);
		}

		toast.remove(id);

		isConnected = connected ? true : false;

		showWalletList = false;
	}
</script>

<div class="">
	<div class="wallet-container">
		<button class="btn" on:click={() => toggleWalletList()}>
			{isConnected ? 'Connected' : 'Connect Wallet'}
		</button>
		{#if showWalletList}
			<ul class="wallet-list">
				{#each availableWallets as wallet}
					<li>
						<button type="button" class="wallet-button" on:click={() => connectWallet(wallet.name)}>
							<img src={wallet.icon} alt="{wallet.name} logo" class="wallet-image" />
							{wallet.name}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<slot></slot>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
		rel="stylesheet"
	/></svelte:head
>

<Toaster />

<style>
	/* Global styles */
	:global(body) {
		font-family: 'Playfair Display', serif;
		margin: 0;
		padding: 0;
		background: linear-gradient(-45deg, #52ee74, #141414, #0ebfff, #161616);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
		height: 100vh;

		color: white;
	}

	.btn {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 12px 24px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 10px;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	.btn:hover {
		background-color: #45a049;
	}

	.wallet-container {
		position: relative;
		display: inline-block;
	}

	.wallet-list {
		position: absolute;
		background-color: #333;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
		list-style-type: none;
		padding: 0;
		margin: 0;
		width: 200px;
	}

	.wallet-list li {
		color: white;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
		cursor: pointer;
	}

	.wallet-list li:hover {
		background-color: #575757;
	}

	.wallet-button {
		background: none;
		outline: none;
		border: none;
		display: flex;
		align-items: center;
		color: white;
		gap: 20px;
		text-transform: capitalize;
	}

	.wallet-button img {
		height: 40px;
		width: auto;
	}
</style>
