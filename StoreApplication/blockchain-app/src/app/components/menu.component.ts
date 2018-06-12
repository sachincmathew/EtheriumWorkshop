import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	@Output() onMenuClicked = new EventEmitter<void>();

	constructor() { }
	
	ngOnInit() { }

	navListClicked() {
		this.onMenuClicked.next();
	}

}
