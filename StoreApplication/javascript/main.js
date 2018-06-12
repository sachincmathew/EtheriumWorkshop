const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const optDef = [
	{ name: 'port', type: Number, defaultOption: 3000 },
	{ name: 'contract', type: String },
	{ name: 'contractAddress', type: String },
	{ name: 'wallet', type: String },
	{ name: 'privateKey', type: String, },
	{ name: 'wsProvider', type: String }
];

const bodyParser = require('body-parser');

const eth = require('./eth');

const options = require('command-line-args')(optDef);

const VERSION = 1;
const PORT = options.port || parseInt(process.env.APP_PORT) || 3000;

//TODO Exercise 0. Start of configuration
//provider's URL 
const PROVIDER_URL = options.wsProvider || 'https://stackup-eth.ngrok.io';

//TODO Set your wallet's address
const WALLET = options.wallet || '0xe3D0aAF2b003c2b1bA922e12480Fe431B4E6b808'

//TODO Set your wallet's private key. Prefix with 0x
//NOTE: For rinkeby only. DO NOT use your real private key
const PRIVATE_KEY = options.privateKey || '0x91b6fbdb0366248ef69dffd487a7960b3bd00f643ea638c6196860bb079254fa'

//TODO Your contract ABI file name here. Please copy to public directory
const CONTRACT_ABI = options.contract || 'MyStore.abi';

//TODO Your contract's address here
const CONTRACT_ADDRESS = options.contractAddress || '0xf7E13b60166BA4b22CB4C914f7c6991DA27b9AF9';

//End of configuration

const app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//TODO Exercise 1. Load W3 and ABI
const Web3 = require('web3');

//TODO Exercise 2. Connect to the Blockchain 
const rinkeby = new Web3(PROVIDER_URL);

//TODO Exercise 3. Parse to ABI to JSON
const buff = fs.readFileSync(path.join(__dirname, 'public', CONTRACT_ABI), 'utf8');
const MyStore = JSON.parse(buff);

//TODO Exercise 4. Instantiate an instance of the contract
const contract = new rinkeby.eth.Contract(MyStore, CONTRACT_ADDRESS);

//End of setup

//TODO Exercise 5. Calling a pure/view method in your contract
app.get(`/api/v${VERSION}/viewOrder`,
	(req, resp) => {

		const address = req.query.address;
		const orderId = parseInt(req.query.orderId);

		//TODO call viewOrder() from your contract
		//Your code below

   	//Return result from viewOrder as JSON
	}
);

//TODO Exercise 5. Optional - checking transaction hash
app.post(`/api/v${VERSION}/checkout/:transaction`,
	(req, resp) => {
		const transaction = req.params.transaction;
		// { transaction: 'transaction', orderId: number, content: 'string', total: number }
		const payload = req.body;

		console.log('payload: ', payload);

		//TODO Call getTransaction() to get the details of the transaction
		//Your code below

   	//Return transaction details as JSON
	}
);

//TODO Exercise 6. Listen to Checkout event


//TODO: Exercise 7. Signing a method
//TODO Listen to Balance event
app.get(`/api/v${VERSION}/balance`,
	(req, resp) => {

		//Get the ABI for checkBalance() from the contract
		const checkBalance = contract.methods.checkBalance().encodeABI();

		//Create a transaction object
		const tx = {
			to: CONTRACT_ADDRESS,
			from: WALLET,
			gas: '2000000',
			data: checkBalance,
			chainId: 4, //Rinkeby
			value: '0'
		};

		//Sign and send the transaction
		rinkeby.eth.accounts.signTransaction(tx, PRIVATE_KEY)
			.then(signed => {
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
	}
);


app.get(`/api/v${VERSION}/balance`,
	(req, resp) => {

		//TODO Get the ABI for checkBalance() from the contract
		//Your code below
		

		//TODO Create a transaction object
		//Your code below
		

		//TODO Sign and send the transaction
		//Your code below

   	//Return balance details as JSON
	}
);

//End of workshop

app.get([`/api/v${VERSION}/ethereum/:currencies`, `/api/v${VERSION}/ethereum`],
	(req, resp) => {
		const curr = req.params['currencies']? req.params['currencies']: 'SGD';
		eth(curr)
			.then(result => {
				resp.status(200).json(result);
			})
			.catch(err => {
				resp.status(400).json(err);
			});
	}
);

//Get store's contract ABI and address
app.get(`/api/v${VERSION}/contract`, 
	(req, resp) => {
		resp.status(200).json({ contract: CONTRACT_ABI, address: CONTRACT_ADDRESS });
	}
);

//Get stores ABI file for compilation
app.get(`/api/v${VERSION}/contract/${CONTRACT_ABI}`,
	(req, resp) => {
		resp.status(200).type('application/json')
			.sendFile(path.join(__dirname, 'public', CONTRACT_ABI));
	}
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'pages')));

app.listen(PORT, () => {
	console.log('Application started at %s on port %d',
			new Date(), PORT);
	console.log('\tprovider url: %s', PROVIDER_URL);
	console.log('\tcontract: %s', CONTRACT_ABI);
	console.log('\taddress: %s', CONTRACT_ADDRESS);
});
