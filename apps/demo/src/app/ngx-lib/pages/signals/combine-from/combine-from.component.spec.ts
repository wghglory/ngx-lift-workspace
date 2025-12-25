import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CombineFromComponent} from './combine-from.component';

describe('CombineFromComponent', () => {
  let component: CombineFromComponent;
  let fixture: ComponentFixture<CombineFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombineFromComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CombineFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
