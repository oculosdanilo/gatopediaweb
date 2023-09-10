import { ModoTema, TemaService } from './../tema.service';
import { Component } from '@angular/core';
import * as $ from 'jquery';
import { FirebaseServiceDatabase } from '../firebasedb.service';

/* criar enum */

type Input = {
  user: string;
  senha: string;
  lembrar?: boolean;
  metodo: 
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private database: FirebaseServiceDatabase,
    private tema: TemaService
  ) {}
  modoAtual = this.tema.temaAtual;
  ModoTema = ModoTema;

  ngOnInit() {
    $('.input-group a').on('mouseout', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'password');
      $('#verSenha').html('visibility_off');
    });
    $('.input-group a').on('mouseover', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'text');
      $('#verSenha').html('visibility');
    });

    $('#username').on('input', () => {
      this.validate();
    });

    $('form').on('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const valores: FormDataEntryValue[] = [...formData.values()];
      const inputData: Input = {
        user: valores[0].toString(),
        senha: valores[1].toString(),
        lembrar: valores[2] != null,
      };

      if (this.validate()) {
        console.log(inputData);
      }
    });
  }

  validate(): boolean {
    const usernameDigitado =
      document.querySelector<HTMLInputElement>('#username')!.value;
    const usernameVal = document.querySelector('#usernameVal')!;
    const regexInvalido = new RegExp('^[a-zA-Z0-9]+$');
    const regexNumeros = new RegExp('^[0-9]+$');

    if (usernameDigitado == '') {
      usernameVal.classList.add('was-validated');
      $('#vazio').show();
      $('#invalido').hide();
      $('#pequeno').hide();
      $('#numerozes').hide();
      return false;
    } else if (!regexInvalido.test(usernameDigitado)) {
      usernameVal.classList.add('was-validated');
      $('#vazio').hide();
      $('#invalido').show();
      $('#pequeno').hide();
      $('#numerozes').hide();
      return false;
    } else if (usernameDigitado.length < 4) {
      usernameVal.classList.add('was-validated');
      $('#vazio').hide();
      $('#invalido').hide();
      $('#pequeno').show();
      $('#numerozes').hide();
      return false;
    } else if (regexNumeros.test(usernameDigitado)) {
      usernameVal.classList.add('was-validated');
      $('#vazio').hide();
      $('#invalido').hide();
      $('#pequeno').hide();
      $('#numerozes').show();
      return false;
    } else {
      usernameVal.classList.remove('was-validated');
      return true;
    }
  }

  mudarTema() {
    if (this.modoAtual == ModoTema.claro) {
      this.tema.mudarTema(ModoTema.escuro);
    } else {
      this.tema.mudarTema(ModoTema.claro);
    }
    this.modoAtual = this.tema.temaAtual;
  }
}
