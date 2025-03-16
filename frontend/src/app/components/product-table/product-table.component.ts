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
    if (product && product.id !== undefined && product.id !== null) {
      console.log("Navegando a detalles del producto con ID:", product.id); // Debug
      this.router.navigate(['/product', product.id]);
    } else {
      console.error("Error: El producto no tiene un ID válido:", product);
    }
  }
  deleteProduct(product: Product): void {
    const confirmDelete = confirm(`Möchtest du das Produkt "${product.name}" wirklich löschen?`);
    if (!confirmDelete) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        console.log(`Produkt ${product.name} gelöscht.`);
        this.loadProducts(); // Recargar la tabla después de eliminar
      },
      error: (err) => {
        console.error("Fehler beim Löschen des Produkts:", err);
        alert("Fehler beim Löschen des Produkts.");
      }
    });
  }

}
