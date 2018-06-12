const Web3 = require('web3');
const fs = require('fs');

//the chain
const rinkeby = new Web3('wss://stackup-eth.ngrok.io/ws');

rinkeby.eth.getTransaction('0x8454ff750b105fb2be11ede207b8ebf05974979d734fa3c274088a1f0625decc')
	.then(tx => console.log('transaction: ', tx));

console.log('is connected: ', rinkeby);



const buff = fs.readFileSync('public\\MyStore.abi', 'utf8');
const MyStore = JSON.parse(buff);

console.log('MyStore: ', MyStore)


//retrieve contract from network
const contract = new rinkeby.eth.Contract(MyStore, '0xf7E13b60166BA4b22CB4C914f7c6991DA27b9AF9')
console.log('contract: ', contract);


const abiCheckBalance = contract.methods.checkBalance(/*if any params, add here*/).encodeABI();

console.log('abiCheckBalance: ', abiCheckBalance);

const tx = {
			to: '0xf7E13b60166BA4b22CB4C914f7c6991DA27b9AF9',
			from: '0xe3D0aAF2b003c2b1bA922e12480Fe431B4E6b808',
			gas: '3000000',
			data: abiCheckBalance,
			chainId: 4, //Rinkeby
			value: '0'
		};
		
rinkeby.eth.accounts.signTransaction(tx, '0x91b6fbdb0366248ef69dffd487a7960b3bd00f643ea638c6196860bb079254fa')
	.then(signed => {
				console.log('signed tx: ', signed);
				rinkeby.eth.sendSignedTransaction(signed.rawTransaction)
					.on('confirmation', (confNum, _) => {
						console.log('confirmation number: ', confNum);
					})
					.on('receipt', receipt => {
						//Return balance details as JSON
						resp.status(201).json(receipt);
					})
					.on('error', error => {
						console.error('error ', error);
						resp.status(400).json({ error: JSON.stringify(error) });
					});
			});