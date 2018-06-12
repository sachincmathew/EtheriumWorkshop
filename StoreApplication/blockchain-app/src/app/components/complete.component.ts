import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PopupComponent } from './popup.component';
import { CartService } from '../services/cart.service';

declare let require: any;

const Web3 = require('web3');

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {

	@ViewChild('txHash') txHashRef: ElementRef;
	txDetails: any;

  constructor(private router: Router, private cartSvc: CartService
		, private http: HttpClient , private activatedRoute: ActivatedRoute
		, private snackBar: MatSnackBar, private dialog: MatDialog) { }

	ngOnInit() {

		const tx = this.activatedRoute.snapshot.queryParams['tx'];

		this.txDetails = JSON.parse(atob(decodeURIComponent(tx)));

		console.info('[transaction details] ', this.txDetails);

		this.txDetails.gasUsed = parseFloat(Web3.utils.fromWei('' + this.txDetails.gasUsed))
		this.txDetails.total = parseFloat(Web3.utils.fromWei('' + this.txDetails.total))

		this.cartSvc.createCart();

		this.cartSvc.onQuantityChanged.next(0);

		this.http.post(`/api/v1/checkout/${this.txDetails.txHash}` , { 
			txHash: this.txDetails.txHash,
			orderId: parseInt(this.txDetails.orderId),
			content: this.txDetails.content,
			total: this.txDetails.total
		})
		.toPromise()
		.catch(error => {
			this.dialog.open(PopupComponent, {
				data: {
					title: 'Error: CompleteComponent.ngOnInit',
					content: JSON.stringify(error)
				}
			})
		});
	}

	copyToClipboard() {
		this.txHashRef.nativeElement.select();
		if (document.execCommand('copy')) 
			this.snackBar.open('Copied', '', { duration: 500 })
				.afterDismissed().subscribe(() => {
					this.txHashRef.nativeElement.selectionStart = 
							this.txHashRef.nativeElement.selectionEnd;
				});
		else
			this.snackBar.open('Copied not supported', '', { duration: 2000 })
	}

	startOver() {
		this.router.navigate(['/']);
	}

}
