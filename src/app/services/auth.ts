import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteModel } from '../models/ClienteModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi = 'https://supersalgadosapi.onrender.com/auth';

  constructor(private http: HttpClient) {};

  login(email: string, senha: string) {
    return this.http.post(`${this.urlApi}/login`, {email, senha});
  }

  cadastrar(cliente: ClienteModel): Observable<any> {
    return this.http.post(`${this.urlApi}/cadastrar`, cliente);
  }
}
