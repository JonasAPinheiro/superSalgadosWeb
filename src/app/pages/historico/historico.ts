import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido/pedido-service';
import { AuthService } from '../../services/auth';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-historico',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './historico.html',
  styleUrl: './historico.scss',
})
export class Historico {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  cliente = this.authService.getClienteLogado();
  private reload$ = new BehaviorSubject<void>(undefined);

  pedidos$: Observable<any[]> = this.reload$.pipe(
    switchMap(() => this.pedidoService.historico(this.cliente.id)),
  );

  calcularTotalGasto(pedidos: any[]): number {
    return pedidos.filter((p) => p.status === 'ativo').reduce((acc, p) => acc + p.total, 0);
  }

  calcularTotalSalgados(pedidos: any[]): number {
    return pedidos
      .filter((p) => p.status === 'ativo')
      .reduce((acc, p) => acc + p.itens.reduce((s: number, i: any) => s + i.quantidade, 0), 0);
  }

  resumoItens(pedido: any): string {
    return pedido.itens.map((i: any) => `${i.quantidade}x ${i.sabor}`).join(', ');
  }

  estornar(pedido: any) {
    if (!confirm('Deseja realmente estornar este pedido?')) return;

    this.pedidoService.estornarPedido(pedido.id).subscribe({
      next: () => {
        const cliente = this.authService.getClienteLogado();
        cliente.saldo += pedido.total;
        this.authService.salvarSessao(cliente);

        this.reload$.next(); 
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao estornar pedido');
      },
    });
  }

  getIcone(sabor: string): string {
    const icones: { [key: string]: string } = {
      Frango: '🍗',
      Carne: '🥩',
      Queijo: '🧀',
      Calabresa: '🌶️',
      Pizza: '🍕',
    };
    return icones[sabor] || '🥟';
  }
}
