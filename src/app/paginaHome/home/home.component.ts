import {Component} from '@angular/core';
import {cookies} from '../../cookies.service';
import {MatButtonModule} from '@angular/material/button';
import {ModoTema, TemaService} from '../../tema.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatDividerModule} from '@angular/material/divider';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ComentarioWiki, FirebaseServiceDatabase, Gato, User} from '../../firebasedb.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ForumComponent} from '../forum/forum.component';
import {WikiComponent} from '../wiki/wiki.component';
import * as $ from 'jquery';
import {NavComponent} from '../nav/nav.component';
import {FirebaseServiceStorage} from '../../firebasest.service';
import {decode} from 'blurhash';
import {Database, onValue, ref, Unsubscribe} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';

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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  animations: [popupAnimation],
  imports: [NgIf, MatDividerModule, NzIconModule, NgOptimizedImage, MatButtonModule,
    MatFormFieldModule, ForumComponent, WikiComponent, NavComponent, NgForOf, MatIconModule],
})
export class HomeComponent {
  username = '';
  photoEdit = document.getElementById('photoEdit')!;
  userInfo: User = {bio: '', senha: ''};

  popupProfileEdit = false;
  popupDelete = false;
  popupProfile = false;
  popupConfig = false;

  gatoEscolhido: Gato | undefined;
  comentarios: ComentarioWiki[] | undefined;
  parar: Unsubscribe | undefined;

  constructor(private cookies: cookies, private tema: TemaService, private firebaseDB: FirebaseServiceDatabase,
              protected firebaseSt: FirebaseServiceStorage, private database: Database, private http: HttpClient) {
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

  toggleProfile() {
    this.popupProfile = !this.popupProfile;
    this.popupConfig = false;
  }

  toggleConfig() {
    this.popupConfig = !this.popupConfig;
    this.popupProfile = false;
  }

  mostrarGato(gato: Gato) {
    this.gatoEscolhido = gato;

    this.gatoEscolhido.descricao = gato.descricao.replaceAll('\\n', '<br />');

    setTimeout(() => {
      const pt1 = document.querySelector('.pt1')!;
      const descricao = document.createElement('p');
      descricao.style.textAlign = 'center';
      descricao.style.maxWidth = '300px';
      descricao.innerHTML = this.gatoEscolhido!.descricao!;
      pt1.appendChild(descricao);

      this.parar = onValue(ref(this.database, `gatos/${gato.nome}/comentarios`),
        (commSnapshot) => {
          this.comentarios = [];

          commSnapshot.forEach((comentario) => {
            if (comentario.val() !== 'null')
              // @ts-ignore
              this.comentarios.push(comentario.val());
          });

          setTimeout(() => {
            const containerCom = document.querySelector('.containerCom')!;
            containerCom.scroll({top: 99999});

            const comentariosDiv = document.querySelector('.comentarios')!;
            const comentariosListaCanvas: NodeListOf<HTMLCanvasElement> =
              comentariosDiv.querySelectorAll('canvas');

            this.http.get('assets/user.webp', {responseType: 'blob'}).subscribe(
              res => {
                const img = new Image();
                img.onload = () => {
                  comentariosListaCanvas.forEach((canvas) => {
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  });
                };
                img.src = URL.createObjectURL(res);
              }
            );
          });
        });

      const canvas = document.getElementById('gatoFoto') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;

      if (gato.imgData) {
        ctx.drawImage(gato.imgData, 0, 0, canvas.width, canvas.height);
      } else {
        const hashString = gato.img.split('&')[1];

        const pixels = decode(hashString, canvas.width, canvas.height);
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);

        let jaCarregou = false;
        setInterval(() => {
          if (gato.imgData && !jaCarregou) {
            let o = 0;

            setInterval(() => {
              ctx.globalAlpha = o;
              ctx.drawImage(gato.imgData!, 0, 0, canvas.width, canvas.height);

              o += 0.01;
              if (o > 1)
                o = 1;
            }, 1);
            jaCarregou = true;
          }
        }, 10);
      }
    });
  }

  dismissGato() {
    this.gatoEscolhido = undefined;
    this.parar!();
    this.comentarios = undefined;
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

  async apagarConta() {
    /*$('#deleteAcc').hide();*/

    await this.firebaseDB.deletarUsuario(this.username);
    /*if (userInfo.img)
      await this.firebaseSt.removerFotoDoUsuario(this.username);*/

    /*this.sair();*/
  }
}
