import { Component, OnInit } from '@angular/core';
import {MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import {Ingredient, Product} from '../../interfaces/models';
import { Router } from '@angular/router';
import {MatIcon} from '@angular/material/icon';



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
        ingredientNames: (p.ingredients as Ingredient[])?.map((i: Ingredient) => i.name).join(', ') || 'Keine',
      }));
    });
  }

  viewDetails(product: Product): void {
    if (product?.id) {
      console.log("Navegando a detalles del producto con ID:", product.id); // Debug
      this.router.navigate(['/product', product.id]);
    }
  }
}
