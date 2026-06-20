import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SalgadoModel } from '../../models/SalgadoModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalgadoService {
  private urlApi = 'https://supersalgadosapi.onrender.com/salgado';
  private http = inject(HttpClient);

  listar(): Observable<SalgadoModel[]> {
    return this.http.get<SalgadoModel[]>(`${this.urlApi}/listar`);
  }
}
