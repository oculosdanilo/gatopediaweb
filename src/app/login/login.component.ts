import { Component } from '@angular/core';
import * as $ from 'jquery';
import 'jquery-validation';
import { FirebaseServiceDatabase } from '../firebasedb.service';

type Input = {
  user: string;
  senha: string;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private database: FirebaseServiceDatabase) {}

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

    $('#username').on('input', (event) => {
      this.validate();
    });

    $('form').on('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const valores: any[] = [...formData.values()];
      const inputData: Input = { user: valores[0], senha: valores[1] };

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
}
