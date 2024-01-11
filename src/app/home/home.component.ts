import { Component } from '@angular/core';
import { cookies } from '../cookies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  username: string = '';

  constructor(private cookies: cookies) {}

  pegarUsername(): string {
    if (this.cookies.get('u') != null) {
      return this.cookies.get('u')!;
    } else {
      return sessionStorage.getItem('u')!;
    }
  }

  ngOnInit() {
    this.username = atob(this.pegarUsername());
  }
}
