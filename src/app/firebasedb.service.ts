import {Injectable} from '@angular/core';
import {Database, get, onValue, ref, set, update,} from '@angular/fire/database';

export enum Motivo {
  naoExiste,
  senhaIncorreta,
}

export type AuthResponse = {
  autenticado: boolean;
  motivoRejeicao?: Motivo;
};

export type Post = {
  content: string;
  img?: boolean;
  username: string;
  likes: {
    lenght: number;
    users: string;
  };
  comentarios: Comentario[]
}

export type Comentario = {
  content: string;
  username: string;
}

export type ComentarioWiki = {
  content: string;
  user: string;
}

export type Gato = {
  nome: string;
  descricao: string;
  img: string;
  resumo: string;
  comentarios: ComentarioWiki[];
  imgData?: HTMLImageElement;
}

export type User = {
  senha: string;
  bio: string;
  img?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceDatabase {
  constructor(private database: Database) {
  }

  comentariosLista: ComentarioWiki[] | undefined;

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

  async pegarGatos(): Promise<Gato[]> {
    let listaGatos: Gato[] = [];
    let listaSnapshot = await get(ref(this.database, 'gatos/'));
    listaSnapshot.forEach((gatoSnapshot) => {
      let gatoAtual: Gato = gatoSnapshot.val();

      listaGatos.push({
        comentarios: gatoAtual.comentarios,
        descricao: gatoAtual.descricao,
        img: gatoAtual.img,
        nome: gatoSnapshot.key,
        resumo: gatoAtual.resumo
      });
    });

    return listaGatos;
  }

  startPegarPosts() {
    onValue(ref(this.database, 'posts/'), (snapshot) => {
      return snapshot;
    });
  }

  async setImg(username: string) {
    await set(ref(this.database, `users/${username}/img`), true);
    return;
  }

  async deletarUsuario(username: string) {
    let todosOsPosts = await get(ref(this.database, 'posts'));
    todosOsPosts.forEach((post) => {
      let postAtual: Post = post.val();

      if (postAtual.username === username) {
        console.log(postAtual);
      }

      postAtual.comentarios.forEach((comentario) => {
        if (comentario.username === username) {
          console.log(comentario);
        }
      });
    });

    let wikiInteira = await get(ref(this.database, 'gatos'));
    wikiInteira.forEach((gato) => {
      let gatoAtual: Gato = gato.val();

      gatoAtual.comentarios.forEach((comentario) => {
        if (comentario.user === username) {
          console.log(comentario);
        }
      });
    });
    /*await remove(ref(this.database, `users/${username}`));*/

    // TODO: fazer o coiso de deletar a conta depois de montar os posts
  }
}
