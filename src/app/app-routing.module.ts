import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { cookies } from './cookies.service';
import { ColabComponent } from './colab/colab.component';

function sim(): any {
  if (new cookies().get('logado') != 'sim') {
    return LoginComponent;
  } else {
    return HomeComponent;
  }
}

const routes: Routes = [
  { path: '', component: sim(), outlet: 'root' },
  { path: 'colab', component: ColabComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
