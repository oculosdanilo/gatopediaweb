import {Component} from '@angular/core';
import {FirebaseServiceDatabase, Gato} from '../../firebasedb.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {decode} from 'blurhash';
import {FirebaseServiceStorage} from '../../firebasest.service';


@Component({
  selector: 'gato-wiki',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.scss'
})
export class WikiComponent {
  listaGatos: Gato[] | undefined;
  jaFoiPegarGatos = false;

  constructor(private firebaseDB: FirebaseServiceDatabase, private fireabaseSt: FirebaseServiceStorage) {
  }

  ngOnInit() {
    this.init().then(() => {
      setTimeout(() => {
        let gatos = document.getElementById('gatos')!;
        let todosOsCanvas: NodeListOf<HTMLCanvasElement> = gatos.querySelectorAll('.gatoImg');

        todosOsCanvas.forEach((canvas) => {
          let canvasIndex = Array.from(todosOsCanvas.values()).indexOf(canvas);
          let gatoImg = this.listaGatos![canvasIndex].img.split('&');
          let hashString = gatoImg[1];

          let pixels =
            decode(hashString, canvas.width, canvas.height);

          const ctx = canvas.getContext('2d')!;
          const imageData = ctx.createImageData(canvas.width, canvas.height);
          imageData.data.set(pixels);
          ctx.putImageData(imageData, 0, 0);

          this.fireabaseSt.pegarFotoDoGato(gatoImg[0]).then((imagemBlob) => {
            let img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = URL.createObjectURL(imagemBlob);
          });
        });
      });
    });
  }

  async init() {
    this.listaGatos = await this.firebaseDB.pegarGatos();
  }
}
