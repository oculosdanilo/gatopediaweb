import {Injectable} from '@angular/core';
import {Database, DataSnapshot, get, onValue, ref, set, Unsubscribe, update,} from '@angular/fire/database';

export enum Motivo {
  naoExiste,
  senhaIncorreta,
}

export type AuthResponse = {
  autenticado: boolean;
  motivoRejeicao?: Motivo;
};

export type User = {
  senha: string;
  bio: string;
  img?: boolean;
};

export var posts: [];

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceDatabase {
  constructor(private database: Database) {
  }

  unsubscribe!: Unsubscribe;

  async getUser(user: string): Promise<User | null> {
    return (
      await get(ref(this.database, 'users/' + user))
    ).val();
  }

  async autenticacao(
    user: string,
    senhaDigitada: string
  ): Promise<AuthResponse> {
    const userInfo = await this.getUser(user);

    if (userInfo == null) {
      return {autenticado: false, motivoRejeicao: Motivo.naoExiste};
    } else if (btoa(senhaDigitada) != userInfo.senha) {
      return {autenticado: false, motivoRejeicao: Motivo.senhaIncorreta};
    } else {
      return {autenticado: true};
    }
  }

  createUser(user: string, value: { senha: string }) {
    return set(ref(this.database, 'users/' + user), {...value, bio: '(vazio)'});
  }

  updateBio(user: string, value: string) {
    return update(ref(this.database, `users/${user}/`), {bio: value});
  }

  pegarGatos(): Promise<DataSnapshot> {
    return get(ref(this.database, 'gatos/'));
  }

  startPegarPosts() {
    this.unsubscribe = onValue(ref(this.database, 'posts/'), (snapshot) => {
      posts = snapshot.val();
    });
  }

  async setImg(username: string) {
    await set(ref(this.database, `users/${username}/img`), true);
    return;
  }

  async deletarUsuario(username: string) {
    let todosOsPosts = await get(ref(this.database, 'posts'));
    console.log(todosOsPosts.val());
    /*await remove(ref(this.database, `users/${username}`));*/
  }
}
