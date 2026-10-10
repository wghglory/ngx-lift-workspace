import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {K8sQuantityComponent} from './k8s-quantity.component';

describe('K8sQuantityComponent', () => {
  let component: K8sQuantityComponent;
  let fixture: ComponentFixture<K8sQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K8sQuantityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(K8sQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
