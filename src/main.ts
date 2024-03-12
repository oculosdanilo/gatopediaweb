/// <reference types="@angular/localize" />

import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {MatIconModule} from '@angular/material/icon';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideStorage, getStorage} from '@angular/fire/storage';
import {provideDatabase, getDatabase} from '@angular/fire/database';
import {environment} from './environments/environment';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {AppRoutingModule} from './app/app-routing.module';
import {BrowserModule, bootstrapApplication} from '@angular/platform-browser';
import {pt_BR, provideNzI18n} from 'ng-zorro-antd/i18n';
import pt from '@angular/common/locales/pt';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

registerLocaleData(pt);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, MatButtonModule, NgOptimizedImage, provideFirebaseApp(() => initializeApp(environment.firebase)), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), NgbModule, MatIconModule),
    provideAnimations(), provideNzI18n(pt_BR), importProvidersFrom(FormsModule), importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
