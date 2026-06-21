import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { PedidoService } from '../../services/pedido/pedido-service';
import { SalgadoService } from '../../services/salgado/salgado-service';
import { SalgadoModel } from '../../models/SalgadoModel';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ItemCarrinho } from '../../models/PedidoModel';
import { AlertaService } from '../../services/alerta/alerta';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private salgadoService = inject(SalgadoService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);
  private alerta = inject(AlertaService);

  private reload$ = new BehaviorSubject<void>(undefined);

  salgados$: Observable<SalgadoModel[]> = this.reload$.pipe(
    switchMap(() => this.salgadoService.listar()),
  );
  carrinho: ItemCarrinho[] = [];

  adicionarAoCarrinho(salgado: SalgadoModel) {
    const itemExistente = this.carrinho.find((item) => item.salgado.id === salgado.id);

    if (itemExistente) {
      if (itemExistente.quantidade >= salgado.quantidadeEstoque) return;
      itemExistente.quantidade++;
    } else {
      if (salgado.quantidadeEstoque === 0) return;
      this.carrinho.push({ salgado, quantidade: 1 });
    }
  }

  removerDoCarrinho(salgadoId: number) {
    this.carrinho = this.carrinho.filter((item) => item.salgado.id !== salgadoId);
  }

  aumentarQuantidade(item: ItemCarrinho) {
    if (item.quantidade >= item.salgado.quantidadeEstoque) return;
    item.quantidade++;
  }

  diminuirQuantidade(item: ItemCarrinho) {
    if (item.quantidade > 1) {
      item.quantidade--;
    } else {
      this.removerDoCarrinho(item.salgado.id);
    }
  }

  getQuantidadeNoCarrinho(salgadoId: number): number {
    const item = this.carrinho.find((i) => i.salgado.id === salgadoId);
    return item ? item.quantidade : 0;
  }

  calcularSubtotalItem(item: ItemCarrinho): number {
    const subtotal = item.salgado.preco * item.quantidade;

    if (item.quantidade >= 10) {
      return subtotal * 0.9;
    }

    return subtotal;
  }

  calcularTotal(): number {
    return this.carrinho.reduce((acc, item) => acc + this.calcularSubtotalItem(item), 0);
  }

  confirmarPedido() {
    if (this.carrinho.length === 0) return;

    const cliente = this.authService.getClienteLogado();

    const pedido = {
      clienteId: cliente.id,
      itens: this.carrinho.map((item) => ({
        salgadoId: item.salgado.id,
        quantidade: item.quantidade,
      })),
    };

    this.pedidoService.criarPedido(pedido).subscribe({
      next: () => {
        const clienteAtualizado = this.authService.getClienteLogado();
        clienteAtualizado.saldo -= this.calcularTotal();
        this.authService.salvarSessao(clienteAtualizado);

        this.alerta.sucesso('Pedido realizado com sucesso!');
        this.carrinho = [];
        this.reload$.next();
      },
      error: (err) => {
        this.alerta.erro('Pedido realizado com sucesso!');
        this.alerta.erro(err.error?.message || 'Erro ao realizar pedido');
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

  getItemCarrinho(salgadoId: number): ItemCarrinho | undefined {
    return this.carrinho.find((i) => i.salgado.id === salgadoId);
  }
}
