import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'gatoroot',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    console.log(this.router.config);
    this.router.navigate([{ outlets: { root: ["login"] } }], { skipLocationChange: true })
  }
}
