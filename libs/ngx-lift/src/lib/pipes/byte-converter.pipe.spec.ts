import {Component, LOCALE_ID} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ByteConverterPipe} from './byte-converter.pipe';

@Component({
  template: `<div>{{ fileSize | byteConverter }}</div>`,
  imports: [ByteConverterPipe],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}],
})
class TestComponent {
  fileSize: number | undefined | null = 0;
}

describe('ByteConverterPipe', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ByteConverterPipe],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should display bytes for file size less than 1kb', () => {
    component.fileSize = 104.89;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('104.89 B');
  });

  it('should transform bytes to KB', () => {
    component.fileSize = 1044.89;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('1.02 KB');
  });

  it('should transform bytes to MB', () => {
    component.fileSize = 2 * 1024 * 1024;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('2 MB');
  });

  it('should transform bytes to GB', () => {
    component.fileSize = 2 * 1024 * 1024 * 1024;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('2 GB');
  });

  it('should transform bytes to TB', () => {
    component.fileSize = 2.89 * 1024 * 1024 * 1024 * 1024;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('2.89 TB');
  });

  it('should handle null input', () => {
    component.fileSize = null;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('');
  });

  it('should handle undefined input', () => {
    component.fileSize = undefined;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('');
  });

  it('should handle NaN input', () => {
    component.fileSize = NaN;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('');
  });
});

@Component({
  template: `<div>{{ fileSize | byteConverter }}</div>`,
  imports: [ByteConverterPipe],
  providers: [{provide: LOCALE_ID, useValue: 'zh-CN'}],
})
class TestChineseComponent {
  fileSize: number | undefined | null = 0;
}

describe('ByteConverterPipe in Chinese', () => {
  let fixture: ComponentFixture<TestChineseComponent>;
  let component: TestChineseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ByteConverterPipe],
    });

    fixture = TestBed.createComponent(TestChineseComponent);
    component = fixture.componentInstance;
  });

  it('should transform bytes to KB in Chinese', () => {
    component.fileSize = 1044.89;
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.textContent).toBe('1.02 千字节');
  });
});

describe('ByteConverterPipe locale fallback', () => {
  it('uses the language translations when the locale contains an unlisted region', () => {
    TestBed.configureTestingModule({providers: [ByteConverterPipe, {provide: LOCALE_ID, useValue: 'fr-FR'}]});
    expect(TestBed.inject(ByteConverterPipe).transform(1024)).toBe('1 Ko');
  });
});

describe('ByteConverter explicit locale', () => {
  it('responds to explicit locale changes and normalizes Chinese script tags', () => {
    const pipe = TestBed.runInInjectionContext(() => new ByteConverterPipe());
    expect(pipe.transform(1024, 'zh-cn')).toBe('1 千字节');
    expect(pipe.transform(1024, 'zh-Hant')).toBe('1 千位元組');
    expect(pipe.transform(1024, 'fr')).toBe('1 Ko');
    expect(pipe.transform(1024, 'bad_locale')).toBe('1 KB');
    expect(pipe.transform(Infinity)).toBeNull();
  });
});
