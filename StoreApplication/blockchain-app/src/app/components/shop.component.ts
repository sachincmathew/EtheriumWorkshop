import { Component, OnInit, AfterContentInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, AfterContentInit {

	private cartSub: Subscription;

	//Should probably use redux here
	inventory: CartItem[] = []; 

	count = 0;

	constructor(private cartSvc: CartService) { }
	
	ngOnInit() { 
		this.inventory = this.cartSvc.loadCart();
		this.count = this.inventory
			.map(v => 'quantity' in v? v.quantity: 0)
			.reduce((acc, curr) => acc + curr, 0);
		this.cartSvc.onQuantityChanged.next(this.count);
	}

	ngAfterContentInit() {
	}

	addToBasket(idx) {
		if (!('quantity' in this.inventory[idx]))
			this.inventory[idx].quantity = 0;
		this.inventory[idx].quantity++;
		this.count++;
		this.cartSvc.saveCart(this.inventory);
		this.cartSvc.onQuantityChanged.next(this.count);
	}

	removeFromBasket(idx, $event) {

		$event.stopPropagation();

		this.count--;
		this.inventory[idx].quantity--;
		if (!this.inventory[idx].quantity)
			delete this.inventory[idx].quantity;
		this.cartSvc.saveCart(this.inventory);
		this.cartSvc.onQuantityChanged.next(this.count);
	}

}
