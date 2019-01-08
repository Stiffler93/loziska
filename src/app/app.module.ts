import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AppComponent} from './app.component';
import {NavigationBarComponent} from './navigation-bar/navigation-bar.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {OurStockComponent} from './our-stock/our-stock.component';
import {OurStoreComponent} from './our-store/our-store.component';
import {GridModule} from '@progress/kendo-angular-grid';
import {PapaParseModule} from 'ngx-papaparse';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, NavigationBarComponent, WelcomePageComponent, OurStockComponent, OurStoreComponent],
  imports: [BrowserModule, AppRoutingModule, AngularFontAwesomeModule, CollapseModule.forRoot(), BsDropdownModule.forRoot(), GridModule,
    PapaParseModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
