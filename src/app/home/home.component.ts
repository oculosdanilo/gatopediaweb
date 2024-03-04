import {Component} from '@angular/core';
import {cookies} from '../cookies.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ModoTema, TemaService} from '../tema.service';
import {NgIf} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {computePosition} from "@floating-ui/dom";

const popupAnimation = trigger('aparecer', [
  transition(':enter', [
    style({opacity: 0, x: -40}),
    animate(
      '400ms ease',
      style({
        opacity: 1,
        x: 0
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms ease',
      style({
        opacity: 0, x: -40,
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
  botaoSair: Element = document.getElementById('sair')!;
  tooltipSair = document.getElementById('tooltip')!;
  bgBlur = document.getElementById("bgBlur")!;

  constructor(private cookies: cookies, private tema: TemaService) {
  }

  ngOnInit() {
    this.username = atob(this.pegarUsername());

    computePosition(this.botaoSair, this.tooltipSair, {
      placement: "bottom",
    })
      .then(({x, y}) => {
        /*Object.assign(this.tooltipSair.style, {left: `${x}px`, top: `${y}px`})*/
        this.tooltipSair.style.left = x + "px";
        this.tooltipSair.style.top = y + "px";
      });
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
