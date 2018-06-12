import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../services/cart.service';
import { MetaMaskService } from '../services/metamask.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

	merchantsWallet: string = '';
	fromServerWallet: string;

	constructor(private router: Router, private cart: CartService
			, private mmask: MetaMaskService) { }
	
	ngOnInit() { 
		const config = this.cart.getConfiguration();
		this.merchantsWallet = config.merchantsWallet;
		this.fromServerWallet = this.mmask.storeAddress;
	}

	saveSettings(setupForm: NgForm) {
		this.cart.saveConfiguration({
			merchantsWallet: setupForm.value.merchantsWallet
		});
		setupForm.reset();
		this.goBack();
	}

	goBack() {
		this.router.navigate(['/']);
	}

}
