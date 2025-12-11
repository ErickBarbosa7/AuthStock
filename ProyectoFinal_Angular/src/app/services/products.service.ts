import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// 1. Definimos la Interfaz para no usar 'any' (Ayuda al autocompletado)
export interface Product {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria?: string;
  marca?: string;
  sku?: string;
  activo?: boolean;
  usuario_registro: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8000/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper para headers
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET: Listar todos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // GET: Obtener uno (Mantiene tu lógica de ?id=...)
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}?id=${id}`);
  }

  // POST: Crear
  createProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product, { headers: this.getHeaders() });
  }

  // PUT: Actualizar
  updateProduct(id: string, product: Product): Observable<any> {
    // Combinamos el ID con los datos del formulario para asegurar que el PHP lo reciba
    const body = { ...product, id: id };
    
    // Enviamos la petición PUT
    return this.http.put(this.apiUrl, body, { headers: this.getHeaders() });
  }

  // DELETE: Eliminar
  deleteProduct(id: string): Observable<any> {
    // Angular requiere esta sintaxis especial para enviar 'body' en un DELETE
    const options = {
      headers: this.getHeaders(),
      body: { id: id }
    };

    return this.http.request('DELETE', this.apiUrl, options);
  }
}