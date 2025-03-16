import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {Product} from '../../interfaces/models';
import {MatGridTile} from '@angular/material/grid-list';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatGridTile,
  ],
})
export class EditProductComponent implements OnInit {
  editProductForm!: FormGroup;
  productId!: number;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Obtener ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // 🔹 Inicializar formulario vacío
    this.editProductForm = this.fb.group({
      ean_gtin: [''],
      category: [''],
      name: [''],
      alcohol_volume: [''],
      deposit_amount: [''],
      caffeine_mg: [''],
      manufacturer: this.fb.group({
        name: [''],
        address: [''],
        country: ['']
      }),
      ingredients: [''],
      nutrition_info: this.fb.group({
        energy_kcal: [''],
        protein_g: [''],
        fat_g: ['']
      }),
      image_url: ['']
    });

    // 🔹 Cargar los datos del producto en el formulario
    if (!isNaN(this.productId)) {
      this.productService.getProductById(this.productId).subscribe(product => {
        if (product) {
          this.editProductForm.patchValue(product);
        }
      });
    }
  }

  submitForm(): void {
    if (this.editProductForm.valid) {
      this.productService.updateProduct(this.productId, this.editProductForm.value).subscribe(() => {
        this.router.navigate(['/products']); // 🔹 Redirigir después de guardar
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/products']); // 🔹 Cancelar y volver a la lista de productos
  }
}
