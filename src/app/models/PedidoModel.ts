import { SalgadoModel } from './SalgadoModel';

export interface PedidoModel {
  clienteId: number;
  itens: ItemPedidoModel[];
}

export interface ItemPedidoModel {
  salgadoId: number;
  quantidade: number;
}

export interface ItemCarrinho {
  salgado: SalgadoModel;
  quantidade: number;
}
