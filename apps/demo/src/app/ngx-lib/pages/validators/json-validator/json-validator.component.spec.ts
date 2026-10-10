import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonValidatorComponent} from './json-validator.component';

describe('JsonValidatorComponent', () => {
  let component: JsonValidatorComponent;
  let fixture: ComponentFixture<JsonValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
