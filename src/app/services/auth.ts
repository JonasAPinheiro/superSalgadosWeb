import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClienteModel } from '../models/ClienteModel';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi = 'https://supersalgadosapi.onrender.com/auth';
  private http = inject(HttpClient);

  private clienteSubject = new BehaviorSubject<any>(this.getClienteLogado());
  cliente$ = this.clienteSubject.asObservable();

  login(email: string, senha: string) {
    return this.http.post(`${this.urlApi}/login`, { email, senha });
  }

  cadastrar(cliente: ClienteModel): Observable<any> {
    return this.http.post(`${this.urlApi}/cadastrar`, cliente);
  }

  salvarSessao(cliente: any) {
    localStorage.setItem('cliente', JSON.stringify(cliente));
    this.clienteSubject.next(cliente);
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
    this.clienteSubject.next(null);
  }
}
