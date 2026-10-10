import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {K8sObjectStatusSignpostDemoComponent} from './k8s-object-status-signpost-demo.component';

describe('K8sObjectStatusSignpostDemoComponent', () => {
  let component: K8sObjectStatusSignpostDemoComponent;
  let fixture: ComponentFixture<K8sObjectStatusSignpostDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K8sObjectStatusSignpostDemoComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(K8sObjectStatusSignpostDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
