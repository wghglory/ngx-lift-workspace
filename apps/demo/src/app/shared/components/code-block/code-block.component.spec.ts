import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CodeBlockComponent} from './code-block.component';

describe('CodeBlockComponent', () => {
  let component: CodeBlockComponent;
  let fixture: ComponentFixture<CodeBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeBlockComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('code', 'test code');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('renders new source immediately while asynchronous highlighting catches up', async () => {
    fixture.componentRef.setInput('code', 'const first = 1;');
    fixture.detectChanges();
    fixture.componentRef.setInput('code', 'const second = 2;');
    fixture.detectChanges();
    expect(component.renderedCode()).toContain('second');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.renderedCode()).toContain('second');
    expect(component.renderedCode()).not.toContain('first');
  });
  it('keeps literal HTML visible before and after asynchronous highlighting', async () => {
    fixture.componentRef.setInput('code', '<span>literal</span>');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('code').textContent).toBe('<span>literal</span>');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('code').textContent).toBe('<span>literal</span>');
  });
});
