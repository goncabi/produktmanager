import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
  ],
})export class CreateProductComponent implements OnInit {
  addProductForm!: FormGroup; // ✅ Cambio de nombre aquí

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({ // ✅ Cambio de nombre aquí
      ean_gtin: ['', Validators.required],
      name: ['', Validators.required],
      image_url: [''],
      price_delivery: [0],
      price_pickup: [0],
      net_volume_l: [0],
      net_weight_g: [0],
      gross_weight_g: [0],
      alcohol_volume: [null],
      caffeine_mg: [null],
      deposit_amount: [null],
      ingredients: [''],
      category: this.fb.group({
        name: ['', Validators.required]
      }),
      manufacturer: this.fb.group({
        name: ['', Validators.required],
        address: [''],
        country: ['']
      }),
      nutritionInfo: this.fb.group({
        energy_kcal: [null],
        protein_g: [null],
        fat_g: [null],
        saturated_fat_g: [null],
        carbohydrates_g: [null],
        sugar_g: [null],
        fiber_g: [null],
        sodium_mg: [null]
      }),
    });
  }

  submitForm(): void {
    if (this.addProductForm.valid) { // ✅ Cambio de nombre aquí
      const newProduct = {
        ...this.addProductForm.value, // ✅ Cambio de nombre aquí
        ingredients: this.convertIngredientsToArray(this.addProductForm.value.ingredients)
      };

      console.log("✅ Produktdaten vor dem Senden:", JSON.stringify(newProduct, null, 2));

      this.productService.addProduct(newProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  convertIngredientsToArray(ingredients: any): { name: string }[] {
    if (!ingredients) return [];

    if (typeof ingredients === "string") {
      return ingredients.split(",").map((name: string) => ({ name: name.trim() }));
    }

    if (Array.isArray(ingredients)) {
      return ingredients.map(ing => (typeof ing === "string" ? { name: ing.trim() } : ing));
    }

    return [];
  }

  cancelCreation(): void {
    this.router.navigate(['/products']);
  }
}

