import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CollapseModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { OurStockComponent } from './our-stock/our-stock.component';
import { OurStoreComponent } from './our-store/our-store.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    WelcomePageComponent,
    OurStockComponent,
    OurStoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    CollapseModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
