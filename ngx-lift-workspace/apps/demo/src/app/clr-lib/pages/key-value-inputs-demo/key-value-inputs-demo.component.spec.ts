import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyValueInputsDemoComponent} from './key-value-inputs-demo.component';

describe('KeyValueInputsDemoComponent', () => {
  let component: KeyValueInputsDemoComponent;
  let fixture: ComponentFixture<KeyValueInputsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueInputsDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueInputsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
