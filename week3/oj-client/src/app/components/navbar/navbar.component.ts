import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = "Collaborative Online Judge";
  profile:any;

  username = "";

  searchBox : FormControl = new FormControl;
  subscription : Subscription;
  constructor(@Inject('auth') private auth,
              @Inject('input') private input,
              private router: Router) { }


  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
      });
    }

    this.subscription = this.searchBox
      .valueChanges
      .subscribe(
        term =>{
          this.input.changeInput(term);
        }
      )
  }

  ngOnDestory(){
    this.subscription.unsubscribe();
  }

  searchProblem(){
    this.router.navigate(['/problems']);
  }

  login() : void{
    this.auth.login()
      .then( (profile) => this.username = profile.nickname);
  }

  logout(): void{
    this.auth.logout();
  }
}
