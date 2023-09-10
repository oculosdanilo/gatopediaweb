import * as $ from 'jquery';
import { Component } from '@angular/core';
import { TemaService } from './tema.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'gatoroot',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private servicoTema: TemaService) {}
  title = 'gatopediaweb';

  ngOnInit() {
    if (window.matchMedia('(max-width: 500px)').matches) {
      const mensagem: string =
        'Oops! Aparentemente você está usando um celular para acessar o site, que não tem otimização para telas menores. Para telefones Android, instale o app pelo Github.\nPor motivos técnicos, não é possível utilizar o aplicativo em celulares com iOS.';
      window.alert(mensagem);
    }
    this.servicoTema.chequeInicial();

    $('html').on('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}
