import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface Configuration {
	merchantsWallet: string;
}

export interface CartItem {
	name: string;
	image?: string;
	price: number;
	quantity?: number;
}

const KEY = 'SETTINGS';

const INVENTORY: CartItem[] = [
	{ name: 'acorn squash', image: '/assets/fruits/acorn_squash.png', price: 1 }, 
	{ name: 'apple', image: '/assets/fruits/apple.png', price: 1 }, 
	{ name: 'bell pepper', image: '/assets/fruits/bell_pepper.png', price: 1 }, 
	{ name: 'blueberries', image: '/assets/fruits/blueberries.png', price: 1 }, 
	{ name: 'broccoli', image: '/assets/fruits/broccoli.png', price: 1 }, 
	{ name: 'carrot', image: '/assets/fruits/carrot.png', price: 1 }, 
	{ name: 'celery', image: '/assets/fruits/celery.png', price: 1 }, 
	{ name: 'chili pepper', image: '/assets/fruits/chili_pepper.png', price: 1 }, 
	{ name: 'corn', image: '/assets/fruits/corn.png', price: 1 }, 
	{ name: 'eggplant', image: '/assets/fruits/eggplant.png', price: 1 }, 
	{ name: 'lettuce', image: '/assets/fruits/lettuce.png', price: 1 }, 
	{ name: 'mushroom', image: '/assets/fruits/mushroom.png', price: 1 }, 
	{ name: 'onion', image: '/assets/fruits/onion.png', price: 1 }, 
	{ name: 'potato', image: '/assets/fruits/potato.png', price: 1 }, 
	{ name: 'pumpkin', image: '/assets/fruits/pumpkin.png', price: 1 }, 
	{ name: 'radish', image: '/assets/fruits/radish.png', price: 1 }, 
	{ name: 'squash', image: '/assets/fruits/squash.png', price: 1 }, 
	{ name: 'strawberry', image: '/assets/fruits/strawberry.png', price: 1 }, 
	{ name: 'sugar snap', image: '/assets/fruits/sugar_snap.png', price: 1 }, 
	{ name: 'tomato', image: '/assets/fruits/tomato.png', price: 1 }, 
	{ name: 'zucchini', image: '/assets/fruits/zucchini.png', price: 1 }
];

@Injectable({
	providedIn: 'root'
})
export class CartService {

	onQuantityChanged = new Subject<number>();

	private cart: CartItem[];
	private markToClear = false;

	constructor() { 
		this.createCart();
	}

	getConfiguration(): Configuration {
		let r = localStorage.getItem(KEY);
		if (r)
			return (<Configuration>JSON.parse(r));

		return (<Configuration>{ merchantsWallet: '' });
	}

	saveConfiguration(config: Configuration) {
		localStorage.setItem(KEY, JSON.stringify(config));
	}

	loadCart(): CartItem[] {
		return (this.cart);
	}

	saveCart(cart: CartItem[]) {
		this.cart = cart;
	}

	createCart() {
		//this.cart = INVENTORY.slice(0) //doesn't seem to work
		this.cart = INVENTORY.map(v => { 
			return ({
				name: v.name,
				image: v.image,
				price: v.price
			});
		});
	}

	getContents(): CartItem[] {
		return (
			this.cart
				.filter(v => ('quantity' in v))
				.map(v => { return ({ name: v.name, price: v.price, quantity: v.quantity }) })
		);
	}

	totalCost(): number {
		return (
			this.cart
				.map(v => ('quantity' in v)? v.quantity * v.price: 0)
				.reduce((acc, curr) => acc + curr, 0)
		);
	}

}
