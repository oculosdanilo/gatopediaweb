import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

function sim(): string {

  return '';
}

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: "login", component: LoginComponent, outlet: "root" },
  { path: "home", component: HomeComponent, outlet: "root" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
