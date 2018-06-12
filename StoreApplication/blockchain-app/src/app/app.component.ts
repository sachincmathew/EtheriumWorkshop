import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MetaMaskService } from './services/metamask.service';
import { CartService } from './services/cart.service';
import { InstallMetamaskComponent } from './components/install-metamask.component';
import { PopupComponent } from './components/popup.component';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	hasMetamask = false;
	disableCheckout = true;

	showCheckout = false;
	showCart = false;

	constructor(public router: Router, private dialog: MatDialog
			, private cartSvc: CartService, private mmask: MetaMaskService) { 
		//Do not need to unsub cause this is the bootstrap component
		const prov = this.mmask.hasMetamask();
		this.hasMetamask = !!prov;
		this.disableCheckout = !!prov;
		if (!this.hasMetamask)
			this.dialog.open(InstallMetamaskComponent)
					.afterClosed().subscribe(
						(result) => {
							if (result)
								window.open('https://metamask.io/', '_self');
						}
					);
		this.cartSvc.onQuantityChanged.subscribe(
			(count) => { 
				this.disableCheckout = (count <= 0) || !this.hasMetamask;
			}
		)
		this.mmask.getContractDetails()
			.catch(error => {
				this.dialog.open(PopupComponent, {
					data: {
						title: 'AppComponent.constructor',
						content: JSON.stringify(error)
					}
				})
			})
		this.router.events.subscribe((routeEvent: Event) => {
			if (routeEvent instanceof NavigationEnd) {
				let url = routeEvent.url;
				this.showCheckout = (url == '/') || (url == '/shop');
				this.showCart = (url == '/checkout')
			}
		});
	}

	gotoCheckout() {
		if (!this.disableCheckout)
			this.router.navigate(['/checkout']);
	}
}
