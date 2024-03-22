/// <reference types="@angular/localize" />

import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {MatIconModule} from '@angular/material/icon';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {provideAnimations} from '@angular/platform-browser/animations';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {environment} from './environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {NgOptimizedImage, registerLocaleData} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {AppRoutingModule} from './app/app-routing.module';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideNzI18n, pt_BR} from 'ng-zorro-antd/i18n';
import pt from '@angular/common/locales/pt';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {initializeAppCheck, provideAppCheck, ReCaptchaV3Provider,} from '@angular/fire/app-check';
import {getAuth, provideAuth} from '@angular/fire/auth';

registerLocaleData(pt);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, MatButtonModule, NgOptimizedImage, provideFirebaseApp(() => initializeApp(environment.firebase)), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), NgbModule, MatIconModule),
    provideAnimations(),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(provideAppCheck(() => {
      const provider = new ReCaptchaV3Provider('6LcI6qApAAAAAD92HghJG6BpyTejvIzKQBb2lpPz');
      return initializeAppCheck(undefined, {provider, isTokenAutoRefreshEnabled: true});
    })),
    importProvidersFrom(provideDatabase(() => getDatabase())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideAuth(() => getAuth())),
  ],
}).catch((err) => console.error(err));
