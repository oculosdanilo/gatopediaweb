import * as $ from 'jquery';
import { Injectable } from '@angular/core';

export enum ModoTema {
  claro,
  escuro,
}

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  constructor() {}
  modoAtual: ModoTema = ModoTema.escuro;

  chequeInicial() {
    switch ($('html').attr('data-bs-theme')) {
      case 'dark':
        this.modoAtual = ModoTema.escuro;
        break;
      default:
        this.modoAtual = ModoTema.claro;
        break;
    }
  }

  mudarTema(novoModo: ModoTema) {
    this.modoAtual = novoModo;
    switch (novoModo) {
      case ModoTema.escuro:
        $('html').attr('data-bs-theme', 'dark');
        break;
      default:
        $('html').attr('data-bs-theme', 'light');
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
