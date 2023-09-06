import { Component } from '@angular/core';

@Component({
  selector: 'gatoroot',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  ngOnInit() {
    if (window.matchMedia('(max-width: 500px)').matches)
      window.alert(
        'Oops! Aparentemente você está usando um celular para acessar o site, que não tem otimização para telas menores. Para telefones Android, instale o app pelo Github.\nPor motivos técnicos, não é possível utilizar o aplicativo em celulares com iOS.'
      );
  }
}
