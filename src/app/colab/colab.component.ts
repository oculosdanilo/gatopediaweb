import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

const popupAnimation = trigger('aparecer', [
  transition(':enter', [
    style({ opacity: 0, scale: 1.1 }),
    animate(
      '500ms',
      style({
        opacity: 1,
        scale: 1,
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '500ms',
      style({
        opacity: 0,
      })
    ),
  ]),
]);

@Component({
  selector: 'app-colab',
  templateUrl: './colab.component.html',
  styleUrls: ['./colab.component.css'],
  animations: [popupAnimation],
})
export class ColabComponent {
  popup: boolean = false;

  aparecer() {
    this.popup = true;
  }

  sair() {
    this.popup = false;
  }

  ngOnInit() {
    this.popup = window.location.href.includes('colab');
  }
}
