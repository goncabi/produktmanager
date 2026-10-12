import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../interfaces/models';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IconComponent } from '../icon/icon.component';
import { AmountPipe } from '../../pipes/amount.pipe';

/** Eine Zeile der Nährwerttabelle; sub = eingerückter Unterwert. */
interface NutritionRow {
  label: string;
  value: number | null | undefined;
  unit: string;
  sub?: boolean;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, IconComponent, CurrencyPipe, DecimalPipe, AmountPipe]
})
export class ProductDetailsComponent implements OnInit {
  // Das Bild lädt nicht (Link tot oder blockiert): dann erscheint die Initiale.
  imageFailed = false;

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
    },
    category_id: 0,
    category_name: '',
    manufacturer: { manufacturer_id: 0, name: 'Keine', address: 'Keine', country: 'Keine' }
  };
  ingredientNames: string = '';
  categories: Category[] = [];
  editMode = false;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProduct();
    this.loadCategories();

  }

  loadProduct(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(productId)) {
      this.productService.getProductById(productId).subscribe(
        product => {
          console.log("Produkt empfangen:", product); // 🔥 DEBUG

          if (!product) {
            console.error("Produkt is null");
            return;
          }
          product.manufacturer = product.manufacturer || { id: 0, name: '', address: '', country: '' };

          this.product = product;


          // Aseguramos que `ingredients` sea un array de objetos `Ingredient`
          if (Array.isArray(product.ingredients)) {
            this.product.ingredients = product.ingredients.map(i => ({ name: i.name }));
          }
        },
        error => {
          console.error("Fehler beim Produkt empfangen:", error);
        }
      );
    } else {
      console.error("ID ungültig.");
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  /** 📝 Bearbeiten */
  editProduct(product: Product): void {
    if (product?.product_id) {
      console.log("🔄 Navigiere zur Bearbeitung des Produkts mit ID:", product.product_id);
      this.router.navigate(['/edit-product', product.product_id]);
    } else {
      console.error("⚠️ Fehler: Das Produkt hat keine gültige ID:", product);
    }
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: 'Bist du sicher?',
        message: `Möchtest du das Produkt "${product.name}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.productService.deleteProduct(product.product_id).subscribe({
          next: () => {
            this.snackBar.open('Produkt erfolgreich gelöscht!', 'Schließen', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error("❌ Fehler beim Löschen des Produkts:", err);
            this.snackBar.open('Fehler: Das Produkt konnte nicht gelöscht werden.', 'Schließen', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
        });
      }
    });
  }

  /**
   * Zutatennamen ohne Lücken. Die API liefert für ein Produkt ohne Zutaten
   * eine Zeile mit name: null (LEFT JOIN), die hier nicht als Chip erscheinen soll.
   */
  ingredientList(): string[] {
    return (this.product.ingredients ?? [])
      .map((ingredient) => ingredient.name)
      .filter((name): name is string => !!name);
  }

  nutritionRows(): NutritionRow[] {
    const n = this.product.nutritionInfo;
    return [
      { label: 'Energie', value: n?.energy_kcal, unit: 'kcal' },
      { label: 'Eiweiß', value: n?.protein_g, unit: 'g' },
      { label: 'Fett', value: n?.fat_g, unit: 'g' },
      { label: 'Gesättigte Fettsäuren', value: n?.saturated_fat_g, unit: 'g', sub: true },
      { label: 'Kohlenhydrate', value: n?.carbohydrates_g, unit: 'g' },
      { label: 'Zucker', value: n?.sugar_g, unit: 'g', sub: true },
      { label: 'Ballaststoffe', value: n?.fiber_g, unit: 'g' },
      { label: 'Natrium', value: n?.sodium_mg, unit: 'mg' },
    ];
  }

  cancelEdit(): void {
    this.editMode = false;
    this.loadProduct();
  }

}
