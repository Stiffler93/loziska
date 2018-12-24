import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {OurStockComponent} from './our-stock/our-stock.component';
import {OurStoreComponent} from './our-store/our-store.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'our-stock', component: OurStockComponent },
  { path: 'our-store', component: OurStoreComponent },
  { path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
