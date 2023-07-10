import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseUrl='http://localhost:8081'

  constructor(private httpClient: HttpClient,
              private router: Router) {

  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // register(data: User): Observable<User> {
  //   return this.httpClient.post<UserInfo>(`${this.baseUrl}/auth/register`, data);
  // }

  login(username: string, password: string): Observable<any> {
    const formData: any = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    console.log('auth service')
    return this.httpClient.post<any>(`${this.baseUrl}/auth/login`, formData).pipe(
      map(data => {
        localStorage.setItem('token', data.token)
        this.router.navigate(['/']);
        return data;
      })
    );
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  redirectToLogin(): void {
    this.router.navigate(['login']);
  }
}