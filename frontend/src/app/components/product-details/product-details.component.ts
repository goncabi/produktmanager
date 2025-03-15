import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/models';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule, CurrencyPipe]
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    id: 0,
    ean_gtin: '',
    category: { id: 0, name: 'Keine' },
    name: '',
    image_url: '',
    sku_plu: '',
    description: '',
    price_delivery: 0,
    price_pickup: 0,
    net_weight_g: 0,
    net_volume_l: 0,
    alcohol_volume: 0,
    caffeine_mg: 0,
    deposit_amount: 0,
    manufacturer: { id: 0, name: 'Keine', address: 'Keine', country: 'Keine' },
    ingredients: [],
    nutrition_info: { energy_kcal: 0, protein_g: 0, fat_g: 0, sugar_g: 0 }
  };

  editMode = false;
  originalProduct: Product | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe(product => {
        console.log("Producto recibido en Angular:", product); // ✅ Debug

        // 🔹 Asignamos el producto correctamente
        this.product = { ...product };
        this.originalProduct = { ...product };

        // 🔹 Transformar ingredientes en texto
        this.product.ingredientNames = product.ingredients?.map(i => i.name).join(', ') || 'Keine';

        // 🔹 Si no hay valores en manufacturer, evitamos errores
        this.product.manufacturer = this.product.manufacturer || { name: 'Keine', address: 'Keine', country: 'Keine' };

        // 🔹 Si no hay info nutricional, evitamos errores
        this.product.nutritionInfo = this.product.nutritionInfo || {
          energy_kcal: 'N/A', protein_g: 'N/A', fat_g: 'N/A', sugar_g: 'N/A'
        };
      });
    }
  }


  cancelEdit(): void {
    if (this.originalProduct) {
      this.product = { ...this.originalProduct };
    }
    this.editMode = false;
  }
}
