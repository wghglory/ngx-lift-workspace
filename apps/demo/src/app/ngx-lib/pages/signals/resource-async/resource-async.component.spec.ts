import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceAsyncComponent} from './resource-async.component';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('ResourceAsyncComponent', () => {
  let component: ResourceAsyncComponent;
  let fixture: ComponentFixture<ResourceAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceAsyncComponent],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
