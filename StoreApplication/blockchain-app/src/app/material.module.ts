import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MODULES = [
	FlexLayoutModule,
	MatSidenavModule, MatToolbarModule, MatListModule,
	MatIconModule, MatFormFieldModule,  MatInputModule,
	MatButtonModule, MatDialogModule, MatSnackBarModule
];

@NgModule({
	imports: MODULES,
	exports: MODULES
})
export class MaterialModule { }
