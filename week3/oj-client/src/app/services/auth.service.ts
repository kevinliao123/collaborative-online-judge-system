// src/app/auth/auth.service.ts

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import {Http, Response, Headers} from '@angular/http'


(window as any).global = window;

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'MbQ_FU7lXHVzet16qTgcfCk6Z9vwB2Kt',
    domain: 'kevinonlinejudge.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://54.89.210.16:3000/',
    scope: 'openid profile'
  });

  userProfile: any;

  constructor(public router: Router, private http: Http) {
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  public getProfile(cb) : void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  public resetPassword() {
    let headers = new Headers({'content-type': 'application/json'});
    let url: string = 'https://kevinonlinejudge.auth0.com/dbconnections/change_password';
    let body = {
      client_id: 'MbQ_FU7lXHVzet16qTgcfCk6Z9vwB2Kt',
      email: this.userProfile.name,
      connection: 'Username-Password-Authentication'
    };

    this.http.post(url, body, {headers: headers})
      .toPromise().then((res: Response) => {
      console.log(res.json());
    }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }

}

