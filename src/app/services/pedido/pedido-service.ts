import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PedidoModel } from '../../models/PedidoModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private urlApi = 'https://supersalgadosapi.onrender.com/pedido';
  private http = inject(HttpClient);

  criarPedido(pedido: PedidoModel): Observable<any> {
    return this.http.post(`${this.urlApi}/criar`, pedido);
  }

  estornarPedido(pedidoId: number): Observable<any> {
    return this.http.patch(`${this.urlApi}/estornar/${pedidoId}`, {});
  }

  historico(clienteId: number): Observable<any> {
    return this.http.get(`${this.urlApi}/historico/${clienteId}`);
  }
}
