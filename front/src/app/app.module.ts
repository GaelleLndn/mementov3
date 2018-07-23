import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ApiService } from './services/api.service';
import { CategoriesComponent } from './categories/categories.component';
import { LogsComponent } from './logs/logs.component'

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
