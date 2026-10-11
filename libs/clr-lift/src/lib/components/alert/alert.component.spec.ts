import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertComponent} from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the error message instead of content when both are supplied', () => {
    fixture.componentRef.setInput('error', new Error('API failed'));
    fixture.componentRef.setInput('content', 'Fallback content');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('API failed');
    expect(fixture.nativeElement.textContent).not.toContain('Fallback content');
  });
});
