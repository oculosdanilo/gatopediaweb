import { Component } from '@angular/core';
import * as $ from 'jquery';
import 'jquery-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  ngOnInit() {
    $('.input-group a').on('mouseout', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'password');
      $('#verSenha').html('visibility_off');
    });
    $('.input-group a').on('mouseover', function (event) {
      event.preventDefault();
      $('#senha').attr('type', 'text');
      $('#verSenha').html('visibility');
    });

    $('form').on('submit', (event) => {
      event.preventDefault();
      const username = document.querySelector<HTMLInputElement>('#username')!;

      if (username.value == '') {
      }
    });

    /* (() => {
      "use strict";

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll(".needs-validation");

      // Loop over them and prevent submission
      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (!(form as HTMLInputElement).checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }

            form.classList.add("was-validated");
          },
          false
        );
      });
    })(); */
  }
}
