import {TestBed} from '@angular/core/testing';

import {TranslationService} from '../services/translation.service';
import {TranslatePipe} from './translate.pipe';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translationServiceMock: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    // Create a mock TranslationService
    translationServiceMock = jasmine.createSpyObj('TranslationService', ['translate']);

    TestBed.configureTestingModule({
      providers: [TranslatePipe, {provide: TranslationService, useValue: translationServiceMock}],
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
