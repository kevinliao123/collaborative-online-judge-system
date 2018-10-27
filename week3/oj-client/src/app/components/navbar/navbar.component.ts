import {Component, Inject, Injectable, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = "Kevin Online Judge System";
  constructor(@Inject("auth") private auth) { }
  profile: any;

  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }

  login():void {
    this.auth.login()
  }

  logout():void {
    this.auth.logout()
  }
}
