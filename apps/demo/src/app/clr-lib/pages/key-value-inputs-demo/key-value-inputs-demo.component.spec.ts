import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';

import {KeyValueRecipesComponent} from './key-value-recipes.component';
import {KeyValueInputsDemoComponent} from './key-value-inputs-demo.component';

describe('KeyValueInputsDemoComponent', () => {
  let component: KeyValueInputsDemoComponent;
  let fixture: ComponentFixture<KeyValueInputsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueInputsDemoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueInputsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it.each(['constructor', 'toString', '__proto__'])('treats %s as an unknown free-text recipe key', (key) => {
    const recipes = fixture.debugElement.query(By.directive(KeyValueRecipesComponent))
      .componentInstance as KeyValueRecipesComponent;
    const config = recipes.recipes().find((recipe) => recipe.id === 'valueSelect')?.valueConfig;
    if (typeof config !== 'function') throw new Error('Expected a dependent value configuration');
    expect(config(key)).toEqual({type: 'select', disabled: true, options: []});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
