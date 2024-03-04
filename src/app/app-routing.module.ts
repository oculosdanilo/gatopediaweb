import {NgModule, Type} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {cookies} from './cookies.service';
import {ColabComponent} from './login/colab/colab.component';

function sim(): Type<any> {
  if (new cookies().get('u') != null || sessionStorage.getItem('u') != null) {
    return HomeComponent;
  } else {
    return LoginComponent;
  }
}

const routes: Routes = [
  {path: '', component: sim(), outlet: 'root'},
  {path: 'colab', component: ColabComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
