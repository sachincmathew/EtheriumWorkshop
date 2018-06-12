import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { MetaMaskService } from '../services/metamask.service';
import { PopupComponent } from './popup.component';

declare let window: any;
declare let require: any;

const Web3 = require('web3');

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

	wallet: string;
	balance: number

	constructor(private router: Router, private dialog: MatDialog,
		private mmask: MetaMaskService) { }
	
	ngOnInit() { 
		this.refreshWallet();
	}

	refreshWallet() {
		this.mmask.getWallet()
			.then(wallet => {
				this.wallet = wallet;
				return (this.mmask.getBalance(wallet));
			})
			.then(balance => {
				this.balance = Web3.utils.fromWei(balance, 'ether');
			})
			.catch(error => {
				this.dialog.open(PopupComponent, {
					data: {
						title: 'Error: WalletComponent.refreshWallet',
						content: error
					}
				})
			});
	}

	goBack() {
		this.router.navigate(['/']);
	}
}
