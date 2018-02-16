import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { ListingComponent } from './components/listing/listing.component';


import { RequestsService } from './services/requests.service';
import { HotelsService } from './services/hotels.service';
import { DateService } from './services/date.service';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DateService, RequestsService, HotelsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
