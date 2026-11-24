import {TestBed} from '@angular/core/testing';
import {vi} from 'vitest';

import {ClrLiftI18nService} from '../services/clr-lift-i18n.service';
import {TranslatePipe} from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translationServiceMock: {translate: ReturnType<typeof vi.fn>};

  beforeEach(() => {
    // Create a mock ClrLiftI18nService
    translationServiceMock = {
      translate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TranslatePipe, {provide: ClrLiftI18nService, useValue: translationServiceMock}],
    });

    // Get an instance of the pipe and inject the mock service
    pipe = TestBed.inject(TranslatePipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call translationService.translate with the provided key and args', () => {
    const key = 'test.key';
    const args = ['arg1', 'arg2'];

    pipe.transform(key, ...args);

    expect(translationServiceMock.translate).toHaveBeenCalledWith(key, ...args);
  });
});
