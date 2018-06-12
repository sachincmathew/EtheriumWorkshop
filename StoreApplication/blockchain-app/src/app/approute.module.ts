import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopComponent } from './components/shop.component';
import { WalletComponent } from './components/wallet.component';
import { SetupComponent } from './components/setup.component';
import { CheckoutComponent } from './components/checkout.component';
import { WaitComponent } from './components/wait.component';
import { CompleteComponent } from './components/complete.component';

const ROUTES: Routes = [
	{ path: '', component: ShopComponent },
	{ path: 'shop', component: ShopComponent },
	{ path: 'setup', component: SetupComponent },
	{ path: 'wallet', component: WalletComponent },
	{ path: 'checkout', component: CheckoutComponent },
	{ path: 'inprogress', component: WaitComponent },
	{ path: 'complete', component: CompleteComponent },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
	imports: [ RouterModule.forRoot(ROUTES) ],
	exports: [ RouterModule ]
})
export class AppRouteModule { }
