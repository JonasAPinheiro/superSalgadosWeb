import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { PedidoService } from '../../services/pedido/pedido-service';
import { SalgadoService } from '../../services/salgado/salgado-service';
import { SalgadoModel } from '../../models/SalgadoModel';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ItemCarrinho } from '../../models/PedidoModel';

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

  salgados$: Observable<SalgadoModel[]> = this.salgadoService.listar();
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

  calcularTotal(): number {
    return this.carrinho.reduce((acc, item) => acc + item.salgado.preco * item.quantidade, 0);
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
        const cliente = this.authService.getClienteLogado();
        cliente.saldo -= this.calcularTotal();
        this.authService.salvarSessao(cliente);

        alert('Pedido realizado com sucesso!');
        this.carrinho = [];
      },
      error: (err) => {
        alert(err.error?.message || 'Erro ao realizar pedido');
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
