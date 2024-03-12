import {getDownloadURL, Storage, ref, uploadBytes} from '@angular/fire/storage';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceStorage {
  constructor(private storage: Storage) {
  }

  async pegarFotoDoUsuario(username: String): Promise<string> {
    return await getDownloadURL(ref(this.storage, `users/${username}.webp`));
  }

  async subirFotoDoUsuario(username: string, imagem: Blob) {
    await uploadBytes(ref(this.storage, `users/${username}.webp`), imagem);
    return;
  }
}
