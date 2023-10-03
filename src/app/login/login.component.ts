import { AuthResponse, Motivo } from './../firebasedb.service';
import { ModoTema, TemaService } from './../tema.service';
import { Component } from '@angular/core';
import * as $ from 'jquery';
import { FirebaseServiceDatabase } from '../firebasedb.service';
import { ColabComponent } from '../colab/colab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage, NgIf } from '@angular/common';

type Input = {
  user: string;
  senha: string;
  lembrar?: boolean;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    NgIf,
    MatIconModule,
    ColabComponent,
  ],
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

    $('form').on('submit', (e) => {
      e.preventDefault();
    });

    $('#entrar').on('click', async () => {
      $('#entrar').attr('disabled', 'true');
      $('#entrar').html();

      const formData = new FormData(
        document.querySelector('form') as HTMLFormElement
      );
      const valores: FormDataEntryValue[] = [...formData.values()];
      const inputData: Input = {
        user: valores[0].toString(),
        senha: valores[1].toString(),
        lembrar: valores[2] != null,
      };

      if (this.validate()) {
        const resposta: AuthResponse = await this.database.autenticacao(
          inputData.user,
          inputData.senha
        );
        $('#entrar').removeAttr('disabled');
        if (!resposta.autenticado) {
          switch (resposta.motivoRejeicao) {
            case Motivo.naoExiste:
              console.log('nao existe');
              break;
            case Motivo.senhaIncorreta:
              console.log('senha incorreta');
              break;
            default:
              console.log('erro desconhecido');
              break;
          }
        } else {
          console.log('sucesso');
        }
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
