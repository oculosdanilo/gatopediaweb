import { Component } from '@angular/core';
import { cookies } from '../cookies.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModoTema, TemaService } from '../tema.service';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

const popupAnimation = trigger('aparecer', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(
      '400ms ease',
      style({
        opacity: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms ease',
      style({
        opacity: 0,
      })
    ),
  ]),
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  animations: [popupAnimation],
  imports: [MatButtonModule, MatIconModule, NgIf],
})
export class HomeComponent {
  username: string = '';
  popupSair: boolean = false;
  botaoSair = document.getElementById('sair')!;
  tooltipSair = document.getElementById('tooltip')!;

  constructor(private cookies: cookies, private tema: TemaService) {}

  ngOnInit() {
    this.username = atob(this.pegarUsername());
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

  toggle() {
    this.popupSair = !this.popupSair;
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
