<script>
	import logo from '$lib/assets/GXzIN2EakAEmnko.jpg';
	import signature from '$lib/assets/signature.png';

	import JsBarcode from 'jsbarcode';
	import { afterUpdate, onMount } from 'svelte';
	import html2canvas from 'html2canvas';

	import toast from 'svelte-french-toast';
	import { userNameStore, walletStore } from '$lib/store';
	import { goto } from '$app/navigation';

	let rollNo = '24AI' + Math.floor(Math.random() * 10);

	let showIdCard = false;
	let showBonafideCertificate = false;

	afterUpdate(() => {
		if (showIdCard) {
			JsBarcode('#barcode', rollNo, {
				format: 'CODE128',
				displayValue: false,
				background: undefined
			});
		}
	});

	onMount(() => {
		if($userNameStore){
			goto("/")
		}
	})
</script>

<div class="actions-container">
	<div class="actions">
		<button
			class="btn"
			on:click={() => {
				showIdCard = true;
				showBonafideCertificate = false;
				toast.loading('Hold up!', {
					duration: 3000
				});

				setTimeout(() => {
					const idCardElement = document.querySelector('.id-card');
					if (idCardElement) {
						// @ts-ignore
						html2canvas(idCardElement).then(async (canvas) => {
							const imageData = canvas.toDataURL('image/png').split(',')[1];
							const formData = new FormData();
							formData.append('image', imageData);
							formData.append('key', process.env.IMGBB_API_KEY ?? ""); // Replace with your actual API key

							try {
								const response = await fetch('https://api.imgbb.com/1/upload', {
									method: 'POST',
									body: formData
								});
								const result = await response.json();
								if (result.success) {
									// toast.success('ID Card uploaded successfully!');

									walletStore.subscribe(async (wallet) => {
										if (!wallet) return;
										const address = await wallet.getChangeAddress();
										const issueResponse = await fetch('/issue', {
											method: 'POST',
											body: JSON.stringify({
												metadata: {
													name: `${address.slice(0, 16)}_ID_CARD`,
													image: result.data.url,
													mediaType: 'image/jpg'
												},
												assetName: `${address.slice(0, 16)}_ID_CARD`,
												recipients: [address]
											})
										});
										const issueResult = await issueResponse.json();

										if (issueResult.txHash) {
											toast.success(issueResult.txHash + ' Check your wallet', {
												duration: 3000
											});
										} else {
											toast.error('Something went wrong!');
										}
									});
								} else {
									toast.error('Failed to upload ID Card');
								}
							} catch (error) {
								toast.error('Error uploading ID Card');
								console.error('Upload error:', error);
							}
						});
					}
				}, 200);
			}}
		>
			Get your ID Card
		</button>
		<button
			on:click={() => {
				showBonafideCertificate = true;
				showIdCard = false;

				toast.loading('Hold up!', {
					duration: 3000
				});

				setTimeout(() => {
					const bonafideCertElement = document.querySelector('.bonafide-certificate');
					if (bonafideCertElement) {
						// @ts-ignore
						html2canvas(bonafideCertElement).then(async (canvas) => {
							const imageData = canvas.toDataURL('image/png').split(',')[1];
							const formData = new FormData();
							formData.append('image', imageData);
							formData.append('key', process.env.IMGBB_API_KEY ?? ""); // Replace with your actual API key

							try {
								const response = await fetch('https://api.imgbb.com/1/upload', {
									method: 'POST',
									body: formData
								});
								const result = await response.json();
								if (result.success) {
									// toast.success('ID Card uploaded successfully!');

									walletStore.subscribe(async (wallet) => {
										if (!wallet) return;
										const address = await wallet.getChangeAddress();
										const issueResponse = await fetch('/issue', {
											method: 'POST',
											body: JSON.stringify({
												metadata: {
													name: `${address.slice(0, 16)}_BONAFIDE_CERTIFICATE`,
													image: result.data.url,
													mediaType: 'image/jpg'
												},
												assetName: `${address.slice(0, 16)}_BONAFIDE_CERTIFICATE`,
												recipients: [address]
											})
										});
										const issueResult = await issueResponse.json();

										if (issueResult.txHash) {
											toast.success(issueResult.txHash + ' Check your wallet', {
												duration: 3000
											});
										} else {
											toast.error('Something went wrong!');
										}
									});
								} else {
									toast.error('Failed to upload ID Card');
								}
							} catch (error) {
								toast.error('Error uploading ID Card');
								console.error('Upload error:', error);
							}
						});
					}
				}, 200);
			}}
			class="btn">Get your Bonafide Certificate</button
		>
	</div>

	{#if showIdCard}
		<div class="id-card">
			<div class="header">
				<h1>ADA University</h1>
			</div>
			<div class="photo">
				<img src={logo} alt="User Photo" />
			</div>
			<div class="details">
				<p>{$userNameStore}</p>
				<p>Cardano Learner</p>
				<p>2024</p>
			</div>

			<div class="barcode-container">
				<svg id="barcode"></svg>
			</div>
		</div>
	{/if}

	{#if showBonafideCertificate}
		<div class="bonafide-certificate">
			<div class="certificate-header">
				<h1>ADA University</h1>
				<h2>Bonafide Certificate</h2>
			</div>
			<div class="certificate-body">
				<p>
					This is to certify that <strong>{$userNameStore}</strong>, son/daughter of
					<strong>{$userNameStore}</strong>, is a bonafide student of
					<strong>ADA University</strong>. He/She is enrolled in the
					<strong>Cardano Learner</strong>
					and has been studying at this institution since <strong> 2024</strong>.
				</p>
			</div>
			<div class="certificate-footer" style="text-align: right;margin-top: 30px;">
				<p>ADA University</p>
				<div class="signature">Signature: <img src={signature} alt="Signature" /></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.signature {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 20px;
	}
	.signature img {
		height: 50px;
		width: 100px;
		object-fit: cover;
	}
	.bonafide-certificate {
		width: 600px;
		border: 10px double #333; /* Beautiful double border */
		border-radius: 15px;
		padding: 40px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
		color: black;
		background: white;
		text-align: center;
	}

	.bonafide-certificate:hover {
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
	}

	.certificate-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		text-decoration: underline;
	}
	.certificate-header h2 {
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}
	.certificate-body p {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}
	.certificate-body h3 {
		font-size: 1.8rem;
		margin: 0.5rem 0;
	}
	.certificate-footer p {
		font-size: 1.2rem;
		margin: 1rem 0;
	}

	.actions-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		flex-direction: column;
	}

	.id-card {
		width: 350px;
		border: 1px solid #333;
		border-radius: 15px;
		padding: 25px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
		background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
		color: #fff;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		position: relative;
		overflow: hidden;
	}
	.id-card:before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, #4caf50, transparent 70%);
		transform: rotate(-25deg);
		animation: rotateBg 10s linear infinite;
		z-index: 1;
	}
	@keyframes rotateBg {
		to {
			transform: rotate(335deg);
		}
	}
	.id-card:hover {
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
	}
	.id-card * {
		position: relative;
		z-index: 2;
	}
	.header {
		text-align: center;
		margin-bottom: 20px;
	}
	.header h1 {
		font-size: 1.8em;
		color: white;
	}
	.photo {
		text-align: center;
		margin-bottom: 20px;
	}
	.photo img {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		border: 3px solid #000000;
	}
	.details {
		text-align: center;
	}
	.details p {
		margin: 6px 0;
		font-size: 1.2em;
	}

	.barcode-container {
		margin-top: 20px;
		display: flex;
		justify-content: center;
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
</style>
