import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { PopupComponent } from './popup.component';

import { MetaMaskService } from '../services/metamask.service';

declare let require: any;

const Web3 = require('web3');

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})
export class WaitComponent implements OnInit, AfterViewInit {

	checkout: any;

	totalCostETH = 0;
	gasEstimateETH = 0;
	wallet: string;
	goods: string;
	value: string;
	valuePlusGas: string;
	
	constructor(private mmask: MetaMaskService, private dialog: MatDialog
			, private router: Router, private activatedRoute: ActivatedRoute) { }

	ngOnInit() {

		const q = this.activatedRoute.snapshot.queryParams['checkout'];

		this.checkout = JSON.parse(atob(decodeURIComponent(q)));

		this.totalCostETH = this.checkout.totalCostETH;
		this.gasEstimateETH = this.checkout.gasEstimateETH;
		this.wallet = this.checkout.wallet;
		this.goods = this.checkout.goods;
		this.value = this.checkout.value;
		this.valuePlusGas = this.checkout.valuePlusGas;
	}

	ngAfterViewInit() {

		this.mmask.store.methods.checkout(this.wallet, this.goods)
			.send({
				from: this.wallet,
				gas: 1000000, //Set max gas to use
				value: this.value
			})
			.then(receipt => {
				console.info('[recepit] ', receipt);
				if (!receipt.status) {
					this.dialog.open(PopupComponent, {
						data: {
							title: `TX Status: ${receipt.status}`,
							content: `Check transaction hash ${receipt.transactionHash}`
						}
					});
					return;
				}
				const result = {
					txHash: receipt.transactionHash,
					gasUsed: receipt.gasUsed,
					orderId: receipt.events.Checkout.returnValues['0'],
					content: receipt.events.Checkout.returnValues['2'],
					total: receipt.events.Checkout.returnValues['3']
				};

				this.router.navigate(['/complete'], {
					queryParams: {
						tx: encodeURIComponent(btoa(JSON.stringify(result)))
					}
				});
			})
			.catch(error => {
				this.dialog.open(PopupComponent, {
					data: {
						title: 'Error: CheckoutComponent.performCheckout',
						content: error
					}
				}).afterClosed().subscribe(
					() => { this.router.navigate(['/checkout']); }
				);
			})
  }
}
