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
import {PapaParseModule} from 'ngx-papaparse';
import {HttpClientModule} from '@angular/common/http';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule} from '@angular/forms';
import { TranslationPipe } from './services/pipes/translation.pipe';
import { ObjTranslationPipe } from './services/pipes/obj-translation.pipe';
import { LanguageComponent } from './language/language.component';

@NgModule({
  declarations: [AppComponent, NavigationBarComponent, WelcomePageComponent, OurStockComponent, OurStoreComponent, TranslationPipe, ObjTranslationPipe, LanguageComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, AngularFontAwesomeModule, CollapseModule.forRoot(), BsDropdownModule.forRoot(),
    PapaParseModule, HttpClientModule, AgGridModule.withComponents([])],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
