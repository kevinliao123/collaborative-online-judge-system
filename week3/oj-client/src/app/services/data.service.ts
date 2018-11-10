import {Injectable} from '@angular/core';
import {Problem} from "../models/problem.model";
import {Http, Response,Headers} from "@angular/http";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class DataService {
  private problemSource = new BehaviorSubject<Problem[]>([])

  constructor(private http: Http) {
  }

  getProblems(): Observable<Problem[]> {
    this.http.get("api/v1/problems")
      .toPromise()
      .then((res: Response) => {
        this.problemSource.next(res.json());
      }).catch(this.handleError);
    return this.problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<Problem> {
    let headers = new Headers({'content-type': 'application/json'});
    return this.http.post('/api/v1/problems', problem, {headers: headers})
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  buildAndRun(data: any): Promise<Object> {
    const headers = new Headers({"content-type":"application/json"});
    return this.http.post('api/v1/build_and_run', data, {headers: headers})
      .toPromise()
      .then((res: Response) => {
        console.log('in client side build and run', res);
        return res.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }
}
