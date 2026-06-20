import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClienteModel } from '../models/ClienteModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi = 'https://supersalgadosapi.onrender.com/auth';
  private http = inject(HttpClient);

  login(email: string, senha: string) {
    return this.http.post(`${this.urlApi}/login`, { email, senha });
  }

  cadastrar(cliente: ClienteModel): Observable<any> {
    return this.http.post(`${this.urlApi}/cadastrar`, cliente);
  }

  salvarSessao(cliente: any) {
    localStorage.setItem('cliente', JSON.stringify(cliente));
  }

  getClienteLogado(): any {
    const cliente = localStorage.getItem('cliente');
    return cliente ? JSON.parse(cliente) : null;
  }

  isLogado(): boolean {
    return !!localStorage.getItem('cliente');
  }

  logout() {
    localStorage.removeItem('cliente');
  }
}
