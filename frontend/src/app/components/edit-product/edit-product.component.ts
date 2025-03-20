import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/models';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';

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
    MatGridListModule,
    ReactiveFormsModule,
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
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Inicializar Formulario
    this.editProductForm = this.fb.group({
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
      ingredients: [''], // Se guardará como string separada por comas
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
    // load data if product exists
    if (!isNaN(this.productId)) {
      this.productService.getProductById(this.productId).subscribe((product: Product) => {
        console.log("📦 Producto recibido en edit:", product);

        if (product) {
          this.editProductForm.patchValue({
            ...product,
            name: this.capitalizeWords(product.name),
            category: { name: this.capitalizeWords(product.category.name) },
            manufacturer: {
              name: this.capitalizeWords(product.manufacturer.name),
              address: product.manufacturer.address, // ✅ Ahora sí se establece la dirección
              country: product.manufacturer.country // ✅ Ahora sí se establece el país
            },
          ingredients: Array.isArray(product.ingredients)
              ? product.ingredients.map((ing: any) => this.capitalizeWords(ing.name)).join(', ')
              : '', // Si no hay ingredientes, dejamos el campo vacío
            nutritionInfo: {
              energy_kcal: product.nutritionInfo?.energy_kcal ?? null,
              protein_g: product.nutritionInfo?.protein_g ?? null,
              fat_g: product.nutritionInfo?.fat_g ?? null,
              saturated_fat_g: product.nutritionInfo?.saturated_fat_g ?? null,
              carbohydrates_g: product.nutritionInfo?.carbohydrates_g ?? null,
              sugar_g: product.nutritionInfo?.sugar_g ?? null,
              fiber_g: product.nutritionInfo?.fiber_g ?? null,
              sodium_mg: product.nutritionInfo?.sodium_mg ?? null
            } // Si nutritionInfo es null, asignamos valores por defecto
          });
        }
      });
    }
  }

  submitForm(): void {
    if (this.editProductForm.valid) {
      const updatedProduct = {
        ...this.editProductForm.value,
        ingredients: this.convertIngredientsToArray(this.editProductForm.value.ingredients)
      };

      console.log("✅ Datos corregidos antes de enviar:", JSON.stringify(updatedProduct, null, 2));

      this.productService.updateProduct(this.productId, updatedProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

// 🔹 Función para convertir ingredientes a un array de objetos correctamente
  convertIngredientsToArray(ingredients: any): { name: string }[] {
    if (!ingredients) return [];

    if (Array.isArray(ingredients)) {
      return ingredients.map(ing => {
        if (typeof ing === "string") {
          return { name: ing.trim() };
        }
        if (typeof ing === "object" && ing.name && typeof ing.name === "string") {
          return { name: ing.name.trim() }; // ✅ Si ya está en el formato correcto, no lo toca.
        }
        return { name: JSON.stringify(ing).trim() }; // 🔥 Evita que se aniden objetos extra.
      });
    }

    if (typeof ingredients === "string") {
      return ingredients.split(",").map((name: string) => ({ name: name.trim() }));
    }

    return [];
  }


    cancelEdit(): void {
    this.router.navigate(['/products']);
  }

  capitalizeWords(value: string): string {
    return value
      ? value
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      : "";
  }

}
