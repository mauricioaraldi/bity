import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { GraphQLConfigModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ExchangesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GraphQLConfigModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
