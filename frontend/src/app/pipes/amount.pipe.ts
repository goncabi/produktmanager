import { formatNumber } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/**
 * Nettomenge eines Produkts: Volumen in Litern, sonst Gewicht in Gramm.
 * Mit Dezimalkomma ("0,5 L"); "–", wenn keins von beiden angegeben ist.
 */
@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);

  transform(product: { net_volume_l?: number | null; net_weight_g?: number | null }): string {
    if (product.net_volume_l) {
      return `${formatNumber(product.net_volume_l, this.locale, '1.0-3')} L`;
    }
    if (product.net_weight_g) {
      return `${formatNumber(product.net_weight_g, this.locale, '1.0-0')} g`;
    }
    return '–';
  }
}
