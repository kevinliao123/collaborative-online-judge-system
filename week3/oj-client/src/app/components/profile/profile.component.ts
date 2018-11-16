import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email:string ='';
  username:string ='';
  constructor(@Inject('auth') private auth) { }

  ngOnInit() {
    this.auth.getProfile((err, profile) => {
      this.email = profile.name;
      this.username = profile.nickname;
      console.log("profile  ====>" + JSON.stringify(profile));
      console.log("profile email ====>" + profile.name );
      console.log("profile name ====>" + profile.nickname );
    });
  }

  resetPassword(){
    this.auth.resetPassword()
  }

}
