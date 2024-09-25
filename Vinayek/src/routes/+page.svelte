<script lang="ts">
	import toast from 'svelte-french-toast';
	import { BrowserWallet } from '@meshsdk/core';
	import type { Wallet } from '@meshsdk/core';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Transaction } from '@meshsdk/core';
	import { userNameStore, walletStore } from '$lib/store';

	let wallet: BrowserWallet | null = null;

	walletStore.subscribe((value) => (wallet = value));
</script>

<div class="container">
	<h1>Welcome to ADA University</h1>
	<div class="input-group">
		<label for="name">Enter your name:</label>
		<input type="text" id="name" bind:value={$userNameStore} placeholder="Your name" />
	</div>
	<button
		class="btn enroll-button"
		on:click={async () => {
			if (wallet) {
				const tx = new Transaction({ initiator: wallet }).sendLovelace(
					'addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr',
					'50000000'
				);

				const unsignedTx = await tx.build();
				const signedTx = await wallet.signTx(unsignedTx);
				const txHash = await wallet.submitTx(signedTx);

				if (txHash) {
					goto('/console');
				}
			} else {
				toast.error('Connect your wallet');
			}
		}}>Enroll</button
	>
</div>

<style>
	.input-group {
		margin-bottom: 1.5rem;
		width: 100%;
		max-width: 400px;
	}

	.input-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
		color: #fff;
	}

	.input-group input {
		width: 100%;
		padding: 10px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.input-group input:focus {
		border-color: #4caf50;
		box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
		outline: none;
	}
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* Container styles */
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	/* Heading styles */
	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	/* Button styles */
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

	/* Input field styles */
	.input-field {
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		width: 100%;
		max-width: 300px;
		font-size: 16px;
	}

	.input-field::placeholder {
		color: #999;
	}

	.already-enrolled {
		display: flex;
		flex-direction: column;
	}

	.already-enrolled p {
		text-align: center;
	}
</style>
