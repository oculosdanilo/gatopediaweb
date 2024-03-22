import {Component} from '@angular/core';
import {cookies} from '../../cookies.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ModoTema, TemaService} from '../../tema.service';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatDividerModule} from '@angular/material/divider';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FirebaseServiceDatabase, User} from '../../firebasedb.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ForumComponent} from '../forum/forum.component';
import {WikiComponent} from '../wiki/wiki.component';
import * as $ from 'jquery';

const popupAnimation = trigger('aparecer', [
  transition(':enter', [
    style({opacity: 0}),
    animate(
      '200ms ease',
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease',
      style({
        opacity: 0,
      })
    ),
  ]),
]);

export var userInfo: User;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  animations: [popupAnimation],
  imports: [MatButtonModule, MatIconModule, NgIf, MatDividerModule, NzIconModule, NgOptimizedImage, MatButtonModule, MatFormFieldModule, MatInputModule, ForumComponent, WikiComponent],
})
export class HomeComponent {
  username = '';
  botaoSair = document.getElementById('sair')!;
  tooltipSair = document.getElementById('tooltip')!;
  bgBlur = document.getElementById('bgBlur')!;
  ano = new Date().getFullYear();
  jaPegouFoto_profilePic: boolean = false;
  photoEdit = document.getElementById('photoEdit')!;

  popupProfileEdit = false;
  popupDelete = false;
  popupProfile = false;

  constructor(private cookies: cookies, private tema: TemaService, private firebaseDB: FirebaseServiceDatabase) {
  }

  ngOnInit() {
    this.username = atob(this.pegarUsername());
  }

  pegarUsername(): string {
    if (this.cookies.get('u')) {
      return this.cookies.get('u')!;
    } else {
      return sessionStorage.getItem('u')!;
    }
  }

  modoAtual = this.tema.temaAtual;
  ModoTema = ModoTema;

  mudarTema() {
    if (this.modoAtual == ModoTema.claro) {
      this.tema.mudarTema(ModoTema.escuro);
    } else {
      this.tema.mudarTema(ModoTema.claro);
    }
    this.modoAtual = this.tema.temaAtual;
  }

  toggleProfileEdit() {
    this.popupProfileEdit = !this.popupProfileEdit;
    this.popupProfile = false;
  }

  toggleDelete() {
    this.popupDelete = !this.popupDelete;
    this.popupProfile = false;
  }

  mouseIn(event: Event) {
    event.preventDefault();
    $('#senha').attr('type', 'text');
    $('#verSenha').html('visibility');
  }

  mouseOut(event: Event) {
    event.preventDefault();
    $('#senha').attr('type', 'password');
    $('#verSenha').html('visibility_off');
  }

  sair() {
    if (this.cookies.get('u')) {
      this.cookies.delete('u');
    } else {
      sessionStorage.removeItem('u');
    }
    location.reload();
  }

  async apagarConta() {
    /*$('#deleteAcc').hide();*/

    await this.firebaseDB.deletarUsuario(this.username);
    /*if (userInfo.img)
      await this.firebaseSt.removerFotoDoUsuario(this.username);*/

    /*this.sair();*/
  }
}
