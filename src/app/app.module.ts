import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ColabComponent } from './colab/colab.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, ColabComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    NgOptimizedImage,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
