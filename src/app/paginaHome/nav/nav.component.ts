import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModoTema} from '../../tema.service';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {FirebaseServiceDatabase, User} from '../../firebasedb.service';
import Cropper from 'cropperjs';
import * as $ from 'jquery';
import {FirebaseServiceStorage} from '../../firebasest.service';
import {cookies} from '../../cookies.service';
import {animate, style, transition, trigger} from '@angular/animations';

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
  selector: 'gato-nav',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    NgIf,
    NgOptimizedImage,
    NzIconDirective
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  animations: [popupAnimation]
})
export class NavComponent {
  constructor(private firebaseSt: FirebaseServiceStorage, private firebaseDB: FirebaseServiceDatabase,
              private cookies: cookies) {
  }

  @Input({required: true}) modoAtual: ModoTema = ModoTema.escuro;
  @Input({required: true}) userInfo: User = {bio: '', senha: ''};
  @Input({required: true}) username: string = '';
  ModoTema = ModoTema;
  editMode = false;
  userBio = '(vazio)';
  ano = new Date().getFullYear();

  @Output() toggleProfileEdit = new EventEmitter<void>();
  @Output() mudarTema = new EventEmitter<void>();
  @Output() toggleDelete = new EventEmitter<void>();
  @Output() toggleProfile = new EventEmitter<void>();
  @Output() toggleConfig = new EventEmitter<void>();

  src = 'assets/user.webp';

  popupSair = false;
  @Input({required: true}) popupConfig = false;
  @Input({required: true}) popupProfile = false;

  ngOnInit() {
    this.init().then();
  }

  async init() {
    this.userInfo = (await this.firebaseDB.getUser(this.username))!;
    this.userBio = this.userInfo.bio;

    if (this.userInfo.img)
      this.src = await this.firebaseSt.pegarFotoDoUsuario(this.username);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  atualizarBio() {
    $('#editando div button, #novaBio').attr('disabled', 'true');
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

  quandoPegarFoto() {
    this.toggleProfileEdit.emit();

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
                  this.toggleProfileEdit.emit();
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

  toggleSair() {
    this.popupSair = !this.popupSair;
    this.popupConfig = false;
    this.popupProfile = false;
  }

  sair() {
    if (this.cookies.get('u')) {
      this.cookies.delete('u');
    } else {
      sessionStorage.removeItem('u');
    }
    location.reload();
  }
}
