import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

declare let require: any;
declare let window: any;

const API_VERSION = 1;

const Web3 = require('web3');

@Injectable({
	providedIn: 'root'
})
export class MetaMaskService {

	rinkeby: any;
	contract: any;
	store: any;
	storeAddress: string;
	filename: string;

	checkoutEvent = new Subject();

	constructor(private http: HttpClient) { 
		if (typeof window.web3 !== 'undefined')
			this.rinkeby = new Web3(window.web3.currentProvider);
	}

	hasMetamask(): any {
		return (this.rinkeby);
	}

	hasCompiled(): boolean {
		return (!!this.store);
	}

	getContractDetails(): Promise<any> {
		return (
			this.http.get(`/api/v${API_VERSION}/contract`)
				.toPromise()
				.then((result: any) => {
					this.storeAddress = result.address;
					this.filename = result.contract;
					return (result);
				})
		);
	}

	compileContract(): Promise<any> {
		return (new Promise<boolean>((resolve, reject) => {
			this.getContractDetails()
				.then((result: any) => {
					this.storeAddress = result.address;
					this.filename = result.contract; 
					return (
						this.http.get(`/api/v${API_VERSION}/contract/${this.filename}`)
								.toPromise()
					);
				})
				.then((result: any) => {
					this.store = new this.rinkeby.eth.Contract(result, this.storeAddress);
					resolve(this.store);
				})
				.catch(error => {
					reject(error);
				})
		}));
	}

	getWallet(): Promise<string> {
		return (this.rinkeby.eth.getAccounts()
			.then(accts => {
				if (accts.length <= 0)
					return (Promise.reject('Cannot find any accounts'));
				return (accts[0]);
			}));
	}

	getBalance(account: string): Promise<number> {
		return (this.rinkeby.eth.getBalance(account));
	}

}
