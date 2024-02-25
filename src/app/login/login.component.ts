// noinspection JSUnresolvedReference

import {AuthResponse, Motivo} from '../firebasedb.service';
import {ModoTema, TemaService} from '../tema.service';
import {Component} from '@angular/core';
import * as $ from 'jquery';
import {FirebaseServiceDatabase} from '../firebasedb.service';
import {ColabComponent} from '../colab/colab.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgOptimizedImage, NgIf} from '@angular/common';
import {cookies} from '../cookies.service';

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
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent {
  constructor(
    private database: FirebaseServiceDatabase,
    private tema: TemaService,
    private cookies: cookies
  ) {
  }

  modoAtual = this.tema.temaAtual;
  ModoTema = ModoTema;
  entrar: boolean | undefined = undefined;
  cadastrar: boolean | undefined = undefined;

  ngOnInit() {
    $('.input-group a').on('mouseout', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'password');
      $('#verSenha').html('visibility_off');
    }).on('mouseover', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'text');
      $('#verSenha').html('visibility');
    });

    $('#username').on('input', () => {
      this.validateLogin();
    });

    $('form').on('submit', (e) => {
      e.preventDefault();
    });

    $('#cadastrar').on('click', async (): Promise<void> => {
      const formData = new FormData(
        document.querySelector('form') as HTMLFormElement
      );
      const valores: FormDataEntryValue[] = [...formData.values()];
      const inputData: Input = {
        user: valores[0].toString(),
        senha: valores[1].toString(),
        lembrar: valores[2] != null,
      };

      if (this.validateLogin()) {
        $('#entrar, #cadastrar').attr('disabled', 'true');
        this.cadastrar = true;

        if ((await this.database.getUser(inputData.user)) != null) {
          $('#cadastrar').removeAttr('disabled');
          this.cadastrar = undefined;
          $('#jaExiste').css('transform', 'scaleY(1)');
          setTimeout(() => {
            $('#jaExiste').css('transform', 'scaleY(0)');
          }, 5000);
        } else {
          await this.database.createUser(inputData.user, {
            senha: btoa(inputData.senha),
          });
          document.querySelector('form')?.reset();
          $('#cadastrar').removeAttr('disabled');
          this.cadastrar = undefined;
          $('#sucessoCadastro').css('transform', 'scaleY(1)');
          setTimeout(() => {
            $('#sucessoCadastro').css('transform', 'scaleY(0)');
          }, 7000);
        }
      }
    });

    $('#entrar').on('click', async () => {
      const formData = new FormData(
        document.querySelector('form') as HTMLFormElement
      );
      const valores: FormDataEntryValue[] = [...formData.values()];
      const inputData: Input = {
        user: valores[0].toString(),
        senha: valores[1].toString(),
        lembrar: valores[2] != null,
      };

      if (this.validateLogin()) {
        $('#entrar, #cadastrar').attr('disabled', 'true');
        this.entrar = true;

        const resposta: AuthResponse = await this.database.autenticacao(
          inputData.user,
          inputData.senha
        );
        if (!resposta.autenticado) {
          switch (resposta.motivoRejeicao) {
            case Motivo.naoExiste:
              $('#naoExiste').css('transform', 'scaleY(1)');
              setTimeout(() => {
                $('#naoExiste').css('transform', 'scaleY(0)');
              }, 5000);
              break;
            case Motivo.senhaIncorreta:
              $('#senhaIncorreta').css('transform', 'scaleY(1)');
              setTimeout(() => {
                $('#senhaIncorreta').css('transform', 'scaleY(0)');
              }, 5000);
              break;
            default:
              $('#desconhecido').css('transform', 'scaleY(1)');
              setTimeout(() => {
                $('#desconhecido').css('transform', 'scaleY(0)');
              }, 5000);
              break;
          }
          $('#entrar').removeAttr('disabled');
          this.entrar = undefined;
        } else {
          $('#entrar').removeAttr('disabled');
          this.entrar = undefined;

          if (inputData.lembrar) {
            this.cookies.set('u', btoa(inputData.user), 365);
          } else {
            sessionStorage.setItem('u', btoa(inputData.user));
          }
          location.reload();
        }
      }
    });
  }

  validateLogin(): boolean {
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

  miau(): void {
    const audio = document.querySelector<HTMLAudioElement>('#audio')!;
    audio.play();
  }
}
