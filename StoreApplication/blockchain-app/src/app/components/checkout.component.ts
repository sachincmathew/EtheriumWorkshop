import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { CartService } from '../services/cart.service';
import { MetaMaskService } from '../services/metamask.service';
import { EthereumService, Ethereum, Rates } from '../services/ethereum.service';

import { PopupComponent } from './popup.component';

declare let require: any;

const Web3 = require('web3');

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


	readonly ten18 = Math.pow(10, 18);

	ethereum: Ethereum;
	rate = -1;
	totalCostSGD = 0;
	totalCostETH = 0;
	totalCostWEI = 0;
	gasEstimateETH = 0;
	gasEstimateWEI = 0;
	wallet: string;
	goods: string;

	constructor(private ethSvc: EthereumService, private cartSvc: CartService
			, private mmask: MetaMaskService, private dialog: MatDialog
			, private router: Router) { }

	ngOnInit() {

		const p = [];
		
		p.push(this.ethSvc.getSGDRate());

		if (!this.mmask.hasCompiled())
			p.push(this.mmask.compileContract())
		else
			p.push(Promise.resolve(this.mmask.store));

		p.push(this.mmask.getWallet());

		Promise.all(p)
			.then(results => {
				this.ethereum = results[0] as Ethereum
				this.rate = 1 / this.ethereum.data['SGD'];
				this.wallet = results[2];
				this.totalCostSGD = this.cartSvc.totalCost();

				return (this.wallet)
			})
			.then(wallet => {
				this.goods = JSON.stringify(this.cartSvc.getContents());
				this.totalCostETH = this.sgdToEth(this.totalCostSGD, this.rate);
				this.totalCostWEI = this.sgdToWei(this.totalCostSGD, this.rate);

				return (this.mmask.store.methods.checkout(this.wallet, this.goods)
					.estimateGas({ 
						from: this.wallet, 
						value: this.ethToWei(this.totalCostETH)
					}));
			})
			.then(gas => {
				this.gasEstimateWEI = gas;
				this.gasEstimateETH = parseFloat(Web3.utils.fromWei('' + gas, 'ether'));
			})
			.catch(error => {
				this.dialog.open(PopupComponent, {
					data: {
						title: 'Error: CheckoutComponent.ngOnInit',
						content: JSON.stringify(error)
					}
				});
			});
	}

	performCheckout() {

		const details = {
			wallet: this.wallet,
			goods: this.goods,
			totalCostETH: this.totalCostETH,
			gasEstimateETH: this.gasEstimateETH,
			value: this.ethToWei(this.totalCostETH),
			valuePlusGas: this.ethToWei(this.totalCostETH + this.gasEstimateETH)
		}

		this.router.navigate(['/inprogress'], {
			queryParams: {
				checkout: encodeURIComponent(btoa(JSON.stringify(details)))
			}
		});
	}

	ethToWei(cost: number) {
		return (Web3.utils.toWei(
			'' + Math.round(cost * this.ten18) / this.ten18)
		);
	}

	private sgdToEth(cost: number, rate) {
		return (Math.round(cost * rate * this.ten18) / this.ten18);
	}

	private sgdToWei(cost: number, rate: number) {
		return (Web3.utils.toWei(
			'' + (Math.round(cost * rate * this.ten18) / this.ten18)
			, 'ether'));
	}
}
