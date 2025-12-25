import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FileReaderDemoComponent} from './file-reader-demo.component';

describe('FileReaderDemoComponent', () => {
  let component: FileReaderDemoComponent;
  let fixture: ComponentFixture<FileReaderDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileReaderDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileReaderDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
