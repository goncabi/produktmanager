import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Ingredient } from '../../interfaces/models';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatExpansionModule, MatCardModule, ReactiveFormsModule] // Agregamos CommonModule y FormsModule
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    product_id: 0,
    ean_gtin: '',
    sku_plu: '',
    name: '',
    description: '',
    image_url: '',
    price_delivery: 0,
    price_pickup: 0,
    net_weight_g: 0,
    net_volume_l: 0,
    gross_weight_g: 0,
    alcohol_volume: 0,
    caffeine_mg: 0,
    deposit_amount: 0,
    ingredients: [],
    nutritionInfo: {
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      saturated_fat_g: 0,
      carbohydrates_g: 0,
      sugar_g: 0,
      fiber_g: 0,
      sodium_mg: 0
    }, // ✅ Se inicializa con valores predeterminados
    category: { category_id: 0, name: 'Keine' },
    manufacturer: { manufacturer_id: 0, name: 'Keine', address: 'Keine', country: 'Keine' }
  };
  ingredientNames: string = '';
  editMode = false;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router // ✅ Inyectamos Router para la navegación
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe(
        product => {
          console.log("Producto recibido en Angular:", product); // 🔥 DEBUG

          if (!product) {
            console.error("El producto es null o undefined");
            return;
          }
          product.manufacturer = product.manufacturer || { id: 0, name: '', address: '', country: '' };
          product.category = product.category || { id: 0, name: '' };

          this.product = product;


          // Aseguramos que `ingredients` sea un array de objetos `Ingredient`
          if (Array.isArray(product.ingredients)) {
            this.product.ingredients = product.ingredients.map(i => ({ name: i.name }));
          }
        },
        error => {
          console.error("Error al obtener producto:", error);
        }
      );
    } else {
      console.error("ID de producto no válido.");
    }
  }
  /** 📝 Bearbeiten */
  editProduct(product: Product): void {
    if (product?.product_id) {
      console.log("🔄 Navigiere zur Bearbeitung des Produkts mit ID:", product.product_id);
      this.router.navigate(['/edit-product', product.product_id]); // ✅ Navegar a la edición del producto
    } else {
      console.error("⚠️ Fehler: Das Produkt hat keine gültige ID:", product);
    }
  }
  /** ❌ Löschen */
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
            Swal.fire('✅ Gelöscht!', 'Das Produkt wurde erfolgreich gelöscht.', 'success');
            this.router.navigate(['/products']); // ✅ Redirigir a la lista de productos
          },
          error: (err) => {
            console.error("❌ Fehler beim Löschen des Produkts:", err);
            Swal.fire('❌ Fehler', 'Das Produkt konnte nicht gelöscht werden.', 'error');
          }
        });
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.loadProduct();
  }
}
