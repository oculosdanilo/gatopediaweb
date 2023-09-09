import { Injectable } from '@angular/core';
import {
  DataSnapshot,
  Database,
  Unsubscribe,
  get,
  onValue,
  ref,
  set,
  update,
} from '@angular/fire/database';

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
  bio?: string;
  img?: boolean;
};

export var posts: [];

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceDatabase {
  constructor(private database: Database) {}
  unsubscribe!: Unsubscribe;

  async getUser(user: string): Promise<User | null> {
    const userInfo: User = (
      await get(ref(this.database, 'users/' + user))
    ).val();
    return userInfo;
  }

  async autenticacao(
    user: string,
    senhaDigitada: string
  ): Promise<AuthResponse> {
    const userInfo = await this.getUser(user);

    if (userInfo == null) {
      return { autenticado: false, motivoRejeicao: Motivo.naoExiste };
    } else if (btoa(senhaDigitada) != userInfo.senha) {
      return { autenticado: false, motivoRejeicao: Motivo.senhaIncorreta };
    } else {
      return { autenticado: true };
    }
  }

  createUser(user: string, value: { senha: string }): Promise<void> {
    return set(ref(this.database, 'users/' + user), value);
  }

  updateBio(user: string, value: string): Promise<void> {
    return update(ref(this.database, 'users/' + user), { bio: value });
  }

  pegarGatos(): Promise<DataSnapshot> {
    return get(ref(this.database, 'gatos/'));
  }

  startPegarPosts(): void {
    this.unsubscribe = onValue(ref(this.database, 'posts/'), (snapshot) => {
      posts = snapshot.val();
    });
  }

  stopPegarPosts(): void {
    this.unsubscribe();
  }
}
