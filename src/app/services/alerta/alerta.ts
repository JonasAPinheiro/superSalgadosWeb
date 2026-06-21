import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  sucesso(mensagem: string) {
    this.toast.fire({
      icon: 'success',
      title: mensagem,
    });
  }

  erro(mensagem: string) {
    this.toast.fire({
      icon: 'error',
      title: mensagem,
    });
  }

  aviso(mensagem: string) {
    this.toast.fire({
      icon: 'warning',
      title: mensagem,
    });
  }

  async confirmar(titulo: string, texto: string): Promise<boolean> {
    const resultado = await Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#de715f',
      cancelButtonColor: '#999',
      confirmButtonText: 'Sim, estornar',
      cancelButtonText: 'Cancelar',
    });

    return resultado.isConfirmed;
  }
}