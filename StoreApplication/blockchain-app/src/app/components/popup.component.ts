import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

	title: string;
	content: string;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit() {
	  console.log('>>> dialogData ', this.dialogData);
	  this.title = this.dialogData.title || "Message";
	  this.content = this.dialogData.content || "Lorem Ipsum";
  }

}
