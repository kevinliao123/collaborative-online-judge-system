import {Component, Inject} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HELLO JIIIIMMMMMM';

  constructor(@Inject("auth") private auth) {
    auth.handleAuthentication();
  }
}
