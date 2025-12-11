import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductsService, Product } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { UiAlertService } from '../../../services/ui-alert.service';

import { finalize } from 'rxjs/operators';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileComponent, HeaderComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  userNames: { [key: string]: string } = {};
  selectedUser: any = null;
  showProfile = false;
  currentUser: any = null;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private uiAlert: UiAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.authService.getToken();
    if (!token) return this.logout();

    this.loadCurrentUser();
    await this.loadUsers();
    this.loadProducts();
  }

  loadCurrentUser() {
    try {
      const storedUser = localStorage.getItem('user');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
      console.log('Usuario logueado:', this.currentUser);
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      this.currentUser = null;
    }
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.getAllUsers().subscribe({
        next: (res: any) => {
          const list = Array.isArray(res) ? res : res?.msg;
          if (Array.isArray(list)) {
            list.forEach(u => {
              this.userNames[u.id] = `${u.nombre} ${u.apellidos}`;
            });
          }
          resolve();
        },
        error: (err) => {
          console.error(err);
          resolve();
        }
      });
    });
  }

  loadProducts() {
    this.uiAlert.showLoading("Cargando productos...");
    this.productService.getProducts()
      .pipe(finalize(() => this.uiAlert.hideLoading()))
      .subscribe({
        next: (data: any) => {
          if (data && !data.error && Array.isArray(data.msg)) {
            this.products = data.msg.map((p: any) => ({
              ...p,
              precio: Number(p.precio),
              stock: Number(p.stock)
            }));
            this.cdr.detectChanges();
          }
        },
        error: err => console.error(err)
      });
  }

  deleteProduct(id: string) {
    this.uiAlert.confirm('¿Eliminar producto?', () => {
      this.uiAlert.showLoading("Eliminando...");
      this.productService.deleteProduct(id)
        .pipe(finalize(() => this.uiAlert.hideLoading()))
        .subscribe({
          next: () => {
            this.uiAlert.success('Producto eliminado');
            this.products = this.products.filter(p => p.id !== id);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error(err);
            this.uiAlert.error('Error al eliminar producto');
          }
        });
    });
  }

  openProfile(userId: string) {
    const userFullData = this.userNames[userId];
    if (!userFullData) return;
    const names = userFullData.split(' ');
    this.selectedUser = {
      id: userId,
      nombre: names[0] || '',
      apellidos: names.slice(1).join(' ') || ''
    };
    this.showProfile = true;
  }

  closeProfile() {
    this.showProfile = false;
  }

  onProfileUpdated(updatedUser: any) {
    this.currentUser = updatedUser;
    this.uiAlert.success("Perfil actualizado correctamente");
  }

  logout() {
    this.authService.logout();
  }

  getInitials(name: string): string {
    if (!name) return 'N/A';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  canEditProduct(product: Product): boolean {
    return String(this.currentUser?.id) === String(product.usuario_registro);
  }
}
