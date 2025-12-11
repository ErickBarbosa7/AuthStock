import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ProductsService } from '../../../services/products.service';
import { UiAlertService } from '../../../services/ui-alert.service';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup; // formulario reactivo
  isEditMode = false; // indica si estamos editando o creando
  productId: string | null = null; // id del producto en caso de editar
  categorias: string[] = [ // lista de categorias disponibles
    'General', 'Alimentos', 'Bebidas', 'Electronica', 'Ropa', 'Calzado',
    'Hogar', 'Oficina', 'Limpieza', 'Salud', 'Belleza', 'Juguetes',
    'Mascotas', 'Herramientas', 'Automotriz', 'Papeleria', 'Tecnologia',
    'Deportes', 'Accesorios', 'Otros'
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private uiAlert: UiAlertService, 
  ) {
    // Inicializa formulario con valores por defecto y validaciones
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoria: ['General'],
      marca: [''],
      sku: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    // detecta si es modo edicion obteniendo el id desde la ruta
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode = true;
      this.loadProductData(this.productId); // carga datos del producto para editar
    } else {
      this.isEditMode = false; // modo creacion
    }
  }

  // carga los datos de un producto por id y llena el formulario
  loadProductData(id: string) {
    this.uiAlert.showLoading('Cargando...');

    this.productService.getProduct(id).subscribe({
      next: (res: any) => {
        this.uiAlert.hideLoading();

        // backend puede devolver msg o el objeto directamente
        let data = res.msg ? res.msg : res;

        // si el backend envia un array, busca el producto correcto
        if (Array.isArray(data)) {
          const found = data.find((item: any) => item.id === id);
          data = found ? found : data[0];
        }

        // convertir a numero para precio y stock
        if (data.precio) data.precio = parseFloat(data.precio);
        if (data.stock) data.stock = parseInt(data.stock, 10);

        // llena el formulario con los datos del producto
        this.productForm.patchValue(data);
      },
      error: (err) => {
        this.uiAlert.hideLoading();
        console.error(err);
        const msg = err?.error?.msg || 'No se pudo cargar el producto';
        this.uiAlert.error(msg); // alerta si hay error
        this.router.navigate(['/products']); // redirige a listado
      }
    });
  }

  // se ejecuta al enviar el formulario
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // marca todos los campos como tocados
      this.uiAlert.warning('Completa los campos obligatorios'); // alerta al usuario
      return;
    }

    const formData = this.productForm.value;
    this.uiAlert.showLoading('Guardando...');

    // decide si actualizar o crear segun el modo
    const action$ = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    action$.subscribe({
      next: () => {
        this.uiAlert.hideLoading();
        const successMsg = this.isEditMode ? 'Producto actualizado' : 'Producto creado';
        this.uiAlert.success(successMsg); // alerta de exito
        this.router.navigate(['/products']); // redirige al listado
      },
      error: (err) => {
        this.uiAlert.hideLoading();
        console.error(err);
        const msg = err?.error?.msg || 'Error en la operacion';
        this.uiAlert.error(msg); // alerta de error
      }
    });
  }

  // valida si un campo del formulario es invalido
  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
}
