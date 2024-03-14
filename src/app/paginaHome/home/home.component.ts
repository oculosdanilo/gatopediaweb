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
import {FirebaseServiceStorage} from '../../firebasest.service';
import Cropper from 'cropperjs';
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
  userBio = '(vazio)';

  src = 'assets/user.webp';

  popupSair = false;
  popupConfig = false;
  popupProfile = false;
  popupProfileEdit = false;
  editMode = false;

  popupDelete = true;

  constructor(private cookies: cookies, private tema: TemaService, private firebaseDB: FirebaseServiceDatabase,
              private firebaseSt: FirebaseServiceStorage) {
  }

  ngOnInit() {
    this.username = atob(this.pegarUsername());

    this.init().then();
  }

  async init() {
    userInfo = (await this.firebaseDB.getUser(this.username))!;
    this.userBio = userInfo.bio;

    if (userInfo.img)
      this.src = await this.firebaseSt.pegarFotoDoUsuario(this.username);
  }

  quandoPegarFoto() {
    this.toggleProfileEdit();

    const profileSelect = document.getElementById('profileSelect') as HTMLInputElement;
    const file = profileSelect.files![0];
    let fr = new FileReader();

    fr.onload = () => {
      let crop = document.getElementById('crop') as HTMLImageElement;

      crop.onload = () => {
        let c = new Cropper(crop, {
          aspectRatio: 1,
        });

        $('#salvarCrop').on('click', () => {
          let canv = c.getCroppedCanvas();
          $('#photoEdit').hide();

          canv.toBlob((blob) => {
              if (blob)
                this.firebaseSt.subirFotoDoUsuario(this.username, blob).then(async () => {
                  c.clear();
                  await this.firebaseDB.setImg(this.username);
                  await this.init();
                  this.toggleProfileEdit();
                });
            },
            'image/webp',
            80);
        });
      };

      crop.src = fr.result as string;
    };

    fr.readAsDataURL(file);
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

  toggleProfileEdit() {
    this.popupProfileEdit = !this.popupProfileEdit;
    this.popupProfile = false;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  toggleDelete() {
    this.popupDelete = !this.popupDelete;
    this.popupProfile = false;
  }

  atualizarBio() {
    $('#editando div button').attr('disabled', 'true');
    let novaBio = $('#novaBio').val() as string;

    if (novaBio !== '') {
      this.firebaseDB.updateBio(this.username, novaBio).then(() => {
        this.init().then(() => {
          $('#editando div button').removeAttr('disabled');
          this.toggleEditMode();
        });
      });
    } else {
      this.firebaseDB.updateBio(this.username, '(vazio)').then(() => {
        this.init().then(() => {
          $('#editando div button').removeAttr('disabled');
          this.toggleEditMode();
        });
      });
    }
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
    $('#deleteAcc').hide();

    await this.firebaseDB.deletarUsuario(this.username);
    if (userInfo.img)
      await this.firebaseSt.removerFotoDoUsuario(this.username);

    this.sair();
  }
}
