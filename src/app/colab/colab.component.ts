import {
  animate,
  group,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

const popupAnimation = trigger('aparecer', [
  transition(':enter', [
    style({ opacity: 0, scale: 1.1 }),
    group([
      animate(
        '400ms ease',
        style({
          opacity: 1,
        })
      ),
      animate('200ms ease', style({ scale: 1 })),
    ]),
  ]),
  transition(':leave', [
    animate(
      '300ms ease',
      style({
        opacity: 0,
      })
    ),
  ]),
]);

@Component({
  selector: 'popup-colab',
  templateUrl: './colab.component.html',
  styleUrls: ['./colab.component.scss'],
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
