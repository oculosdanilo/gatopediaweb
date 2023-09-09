import { Storage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceStorage {
  constructor(private storage: Storage) {}
}
