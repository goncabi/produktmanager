import { Component, OnInit } from '@angular/core';
import {MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import {Ingredient, Product} from '../../interfaces/models';
import { Router } from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  imports: [
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatIcon,
    MatPaginator,
    MatToolbar,
    MatButtonModule,
    MatTooltip
  ],
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {
  displayedColumns: string[] = [
    'ean', 'category', 'name', 'weightVolume',
    'manufacturer', 'actions'
  ];
  dataSource = new MatTableDataSource<Product>();

  constructor(private productService: ProductService, private router: Router) {
  }


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      console.log("Productos recibidos:", products);
      this.dataSource.data = products.map(p => ({
        ...p,
      }));
    });
  }

  viewDetails(product: Product): void {
    if (product && product.product_id !== undefined && product.product_id !== null) {
      console.log("Navegando a detalles del producto con ID:", product.product_id); // Debug
      this.router.navigate(['/product', product.product_id]);
    } else {
      console.error("Error: El producto no tiene un ID válido:", product);
    }
  }

  editProduct(product: Product): void {
    if (product && product.product_id !== undefined && product.product_id !== null) {
      console.log("Navegando a la edición del Producto mit ID:", product.product_id);
      this.router.navigate(['/edit-product', product.product_id]); // Ajusta la ruta según tu app
    } else {
      console.error("Fehler: Das Produkt hat keine gültige ID:", product);
    }
  }


  deleteProduct(product: Product): void {
    Swal.fire({
      title: 'Bist du sicher?',
      text: `Möchtest du das Produkt "${product.name}" wirklich löschen?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, löschen!',
      cancelButtonText: 'Abbrechen',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.product_id).subscribe({
          next: () => {
            Swal.fire('Gelöscht!', 'Das Produkt wurde erfolgreich gelöscht.', 'success');
            this.loadProducts(); // Recargar la tabla después de eliminar
          },
          error: (err) => {
            console.error("Fehler beim Löschen des Produkts:", err);
            Swal.fire('Fehler', 'Das Produkt konnte nicht gelöscht werden.', 'error');
          }
        });
      }
    });
  }
}
