import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';

import {MetaCoinService, Web3Service, RemittanceService} from '../services/services';
import {AliceComponent} from './alice/alice.component';
import {CarolComponent} from './carol/carol.component';
import {Routing} from './app.routing';
import { HomeComponent } from './home/home.component';


const SERVICES = [
  MetaCoinService,
  Web3Service,
  RemittanceService,
]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  declarations: [
    AppComponent,
    AliceComponent,
    CarolComponent,
    HomeComponent
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}, SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule {
}
