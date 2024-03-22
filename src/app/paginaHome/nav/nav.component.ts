import {Component, input, Input, Output} from '@angular/core';
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
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  constructor(private firebaseSt: FirebaseServiceStorage, private firebaseDB: FirebaseServiceDatabase) {
  }

  @Input() modoAtual: ModoTema = ModoTema.escuro;
  @Input() userInfo: User = {bio: '', senha: ''};
  @Input() username: string = '';
  ModoTema = ModoTema;
  editMode = false;
  userBio = '(vazio)';

  src = 'assets/user.webp';

  popupSair = false;
  popupConfig = false;
  @Input() popupProfile = false;

  ngOnInit() {

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
}
