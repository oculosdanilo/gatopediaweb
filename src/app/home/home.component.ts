import {Component} from '@angular/core';
import {cookies} from '../cookies.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ModoTema, TemaService} from '../tema.service';
import {NgIf} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatDividerModule} from '@angular/material/divider';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FirebaseServiceDatabase, User} from '../firebasedb.service';
import {FirebaseServiceStorage} from '../firebasest.service';

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
  imports: [MatButtonModule, MatIconModule, NgIf, MatDividerModule, NzIconModule],
})
export class HomeComponent {
  username = '';
  botaoSair = document.getElementById('sair')!;
  tooltipSair = document.getElementById('tooltip')!;
  bgBlur = document.getElementById('bgBlur')!;
  ano = new Date().getFullYear();

  popupSair = false;
  popupConfig = false;
  popupProfile = false;

  constructor(private cookies: cookies, private tema: TemaService, private firebaseDB: FirebaseServiceDatabase, private firebaseSt: FirebaseServiceStorage) {
  }

  ngOnInit() {
    this.username = atob(this.pegarUsername());

    this.init().then();

    $(document).on('click', (e) => {
      console.log(e.target);
    });
  }

  async init() {
    const userInfoDB = await this.firebaseDB.getUser(this.username);
    if (userInfoDB)
      userInfo = userInfoDB;

    if (userInfo.img) {
      const imagemURL = await this.firebaseSt.pegarFotoDoUsuario(this.username);

      $('#profile').css('background-image', `url(${imagemURL})`);
    }
  }

  pegarUsername(): string {
    if (this.cookies.get('u') != null) {
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

  toggleSair() {
    this.popupSair = !this.popupSair;
    this.popupConfig = false;
    this.popupProfile = false;
  }

  toggleConfig() {
    this.popupConfig = !this.popupConfig;
    this.popupProfile = false;
  }

  toggleProfile() {
    this.popupProfile = !this.popupProfile;
    this.popupConfig = false;
  }

  sair() {
    if (this.cookies.get('u') != null) {
      this.cookies.delete('u');
    } else {
      sessionStorage.removeItem('u');
    }
    location.reload();
  }
}
