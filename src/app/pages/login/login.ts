import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });
  erro: string = '';
  mostrarSenha: boolean = false;

  onSubmit() {
    if (this.form.invalid) return;

    const { email, senha } = this.form.value;

    this.authService.login(email, senha).subscribe({
      next: (cliente) => {
        this.authService.salvarSessao(cliente);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Email ou senha inválidos';
      },
    });
  }

  exibirSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }
}
