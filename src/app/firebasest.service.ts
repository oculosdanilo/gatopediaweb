import {getDownloadURL, Storage, ref} from '@angular/fire/storage';
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
}
