import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { AppRouteModule } from './approute.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './components/menu.component';
import { SetupComponent } from './components/setup.component';
import { WalletComponent } from './components/wallet.component';
import { ShopComponent } from './components/shop.component';
import { CheckoutComponent } from './components/checkout.component';
import { InstallMetamaskComponent } from './components/install-metamask.component';
import { PopupComponent } from './components/popup.component';
import { CompleteComponent } from './components/complete.component';
import { WaitComponent } from './components/wait.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SetupComponent,
    WalletComponent,
    ShopComponent,
    CheckoutComponent,
    InstallMetamaskComponent,
    PopupComponent,
    CompleteComponent,
    WaitComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
	 FormsModule,
	 HttpClientModule,
	 MaterialModule,
	 AppRouteModule
  ],
  entryComponents: [ InstallMetamaskComponent, PopupComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
