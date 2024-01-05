import * as $ from 'jquery';
import { Injectable } from '@angular/core';
import { cookies } from './cookies.service';
import { ThemePalette } from '@angular/material/core';

export enum ModoTema {
  claro,
  escuro,
}

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  constructor(private cookies: cookies) {}
  modoAtual: ModoTema = ModoTema.escuro;

  chequeInicial() {
    const modoSalvo: string | null = this.cookies.get('modoTema');
    if (modoSalvo != null) {
      switch (modoSalvo) {
        case 'dark':
          this.mudarTema(ModoTema.escuro);
          break;
        default:
          this.mudarTema(ModoTema.claro);
          break;
      }
    }
  }

  mudarTema(novoModo: ModoTema) {
    this.modoAtual = novoModo;
    switch (novoModo) {
      case ModoTema.escuro:
        $('html').attr('data-bs-theme', 'dark');
        this.cookies.set('modoTema', 'dark', 365);
        break;
      default:
        $('html').attr('data-bs-theme', 'light');
        this.cookies.set('modoTema', 'light', 365);
        break;
    }
  }

  public get temaAtual(): ModoTema {
    return this.modoAtual;
  }

  public get toString(): string {
    switch (this.modoAtual) {
      case ModoTema.claro:
        return 'claro';
      default:
        return 'escuro';
    }
  }
}
