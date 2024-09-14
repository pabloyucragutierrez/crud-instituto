import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Producto {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  productos: Producto[] = [];
  modalType: string = '';
  selectedProduct: Producto | null = null;
  productForm: Producto = { name: '', description: '', category: '', price: 0, stock: 0 };

  private apiUrl = 'https://crud-productos-nestjs-production.up.railway.app/ansur/api/products';

  constructor(private http: HttpClient) {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http.get<Producto[]>(this.apiUrl).subscribe((data) => {
      this.productos = data;
    });
  }

  openModal(type: string, product: Producto | null = null) {
    this.modalType = type;
    if (type === 'edit' && product) {
      this.productForm = { ...product };
      this.selectedProduct = product;
    } else if (type === 'add') {
      this.productForm = { name: '', description: '', category: '', price: 0, stock: 0 };
      this.selectedProduct = null;
    } else if (type === 'delete' && product) {
      this.selectedProduct = product;
    }
  }

  closeModal() {
    this.modalType = '';
    this.selectedProduct = null;
  }

  saveProduct() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.modalType === 'add') {
      this.http.post<Producto>(this.apiUrl, this.productForm, { headers }).subscribe({
        next: (newProduct) => {
          this.productos.push(newProduct);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al agregar producto:', error);
        }
      });
    } else if (this.modalType === 'edit' && this.selectedProduct) {
      const url = `${this.apiUrl}/${this.selectedProduct.id}`;
      const updateData = {
        name: this.productForm.name,
        description: this.productForm.description,
        category: this.productForm.category,
        price: this.productForm.price,
        stock: this.productForm.stock
      };

      this.http.put<Producto>(url, updateData, { headers }).subscribe({
        next: (updatedProduct) => {
          const index = this.productos.findIndex((p) => p.id === this.selectedProduct!.id);
          if (index !== -1) {
            this.productos[index] = { ...this.selectedProduct, ...updateData };
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al editar producto:', error);
        }
      });
    }
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.apiUrl}/${id}`;
    this.http.delete(url, { headers }).subscribe({
      next: () => {
        this.productos = this.productos.filter((product) => product.id !== id);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }
}
