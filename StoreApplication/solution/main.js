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
//TODO Set the provider's URL 
const PROVIDER_URL = options.wsProvider || '__DEFAULT_PROVIDER_URL__';

//TODO Set your wallet's address
const WALLET = options.wallet || '__DEFAULT_WALLET__'

//TODO Set your wallet's private key. Prefix with 0x
//NOTE: For rinkeby only. DO NOT use your real private key
const PRIVATE_KEY = options.privateKey || '__DEFAULT_PRIVATE_KEY__'

//TODO Your contract ABI file name here. Please copy to public directory
const CONTRACT_ABI = options.contract || '__DEFAULT_CONTRACT_ABI__';

//TODO Your contract's address here
const CONTRACT_ADDRESS = options.contractAddress || '__DEFAULT_CONTRACT_ADDRESS__';

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

//Exercise 4. Instantiate an instance of the contract
const contract = new rinkeby.eth.Contract(MyStore, CONTRACT_ADDRESS);

//End of setup

//TODO Exercise 5. Calling a pure/view method in your contract
app.get(`/api/v${VERSION}/viewOrder`,
	(req, resp) => {

		const address = req.query.address;
		const orderId = parseInt(req.query.orderId);

		//TODO call viewOrder() from your contract
		//Your code below
		contract.methods.viewOrder(address, orderId)
			.call()
			.then(result => {
				
   	//Return result from viewOrder as JSON
				resp.status(200).json({ 
					customer: address,
					orderId: orderId,
					contents: JSON.parse(result.contents),
					total: Web3.utils.fromWei(result.total, 'ether'),
					orderDate: new Date(parseInt(result.date) * 1000),
					time: new Date() 
				});
			})
			.catch(error => {
				console.log('error = ', error);
				resp.status(400).json({ error: error });
			});
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
		rinkeby.eth.getTransaction(transaction)
			.then(result => {
				
   	//Return transaction details as JSON
				resp.status(201).json(result);
			})
			.catch(error => {
				resp.status(400).json({ error: error });
			})
	}
);

//TODO Exercise 6. Listen to Checkout event
contract.events.Checkout()
	.on('data', data => {
		const result = data.returnValues;
		const txHash = data.transactionHash;
		console.log('event: Checkout');
		console.log('\tordId: ', result.ordId);
		console.log('\tdate: %s', new Date(parseInt(result.date) * 1000)),
		console.log('\tcustomer: ', result.customer);
		console.log('\tcontents: ', JSON.parse(result.contents));
		console.log('\ttotal: %s ETH', Web3.utils.fromWei(result.total, 'ether'));
	})
	.on('error', error => {
		console.error('error = ', error);
	});


//TODO: Exercise 7. Signing a method
//TODO Listen to Balance event
contract.events.Balance()
	.on('data', data => {
		console.log('event: Balance: %s ETH', Web3.utils.fromWei(data.returnValues.balance, 'ether'));
	})
	.on('error', error => {
		console.error('event: Balance error: ', error);
	});

app.get(`/api/v${VERSION}/balance`,
	(req, resp) => {

		//TODO Get the ABI for checkBalance() from the contract
		//Your code below
		const checkBalance = contract.methods.checkBalance().encodeABI();

		//TODO Create a transaction object
		//Your code below
		const tx = {
			to: CONTRACT_ADDRESS,
			from: WALLET,
			gas: '2000000',
			data: checkBalance,
			chainId: 4, //Rinkeby
			value: '0'
		};

		//TODO Sign and send the transaction
		//Your code below
		rinkeby.eth.accounts.signTransaction(tx, '0x' + PRIVATE_KEY)
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
