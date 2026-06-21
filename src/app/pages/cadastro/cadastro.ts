import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss'],
})
export class Cadastro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
    confirmarSenha: ['', Validators.required],
  });
  erro: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  exibirSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  exibirConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { nome, email, senha, confirmarSenha } = this.form.value;

    if (senha !== confirmarSenha) {
      this.erro = 'As senhas estão diferentes';
      return;
    }

    const cliente = { nome, email, senha, saldo: 1000 };

    this.authService.cadastrar(cliente).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao cadastrar';
      },
    });
  }
}
