import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AmountPipe } from './amount.pipe';

describe('AmountPipe', () => {
  let pipe: AmountPipe;

  beforeEach(() => {
    registerLocaleData(localeDe);
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }] });
    pipe = TestBed.runInInjectionContext(() => new AmountPipe());
  });

  it('shows the volume in litres with a decimal comma', () => {
    expect(pipe.transform({ net_volume_l: 0.5, net_weight_g: 0 })).toBe('0,5 L');
    expect(pipe.transform({ net_volume_l: 0.33 })).toBe('0,33 L');
  });

  it('falls back to the weight when there is no volume', () => {
    expect(pipe.transform({ net_volume_l: 0, net_weight_g: 45 })).toBe('45 g');
  });

  it('shows a dash when neither is set', () => {
    expect(pipe.transform({ net_volume_l: 0, net_weight_g: 0 })).toBe('–');
    expect(pipe.transform({})).toBe('–');
  });
});
