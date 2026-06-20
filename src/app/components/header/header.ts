import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  nomeCliente: string = "";

  ngOnInit() {
    const cliente = this.authService.getClienteLogado();
    this.nomeCliente = cliente?.nome || '';
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
