import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ClrTimelineStepState} from '@clr/angular';
import {TimelineWizardService} from 'clr-lift';

import {ConfigureRuntimePropComponent} from './configure-runtime-prop.component';

describe('ConfigureRuntimePropComponent', () => {
  let component: ConfigureRuntimePropComponent;
  let fixture: ComponentFixture<ConfigureRuntimePropComponent>;
  let timelineWizardService: TimelineWizardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureRuntimePropComponent],
      providers: [TimelineWizardService],
    }).compileComponents();

    timelineWizardService = TestBed.inject(TimelineWizardService);
    timelineWizardService.steps = [
      {
        id: 'runtime-props',
        state: ClrTimelineStepState.CURRENT,
        title: 'Configure Runtime Properties',
        component: ConfigureRuntimePropComponent,
        data: {
          appProperties: {},
        },
      },
    ];

    fixture = TestBed.createComponent(ConfigureRuntimePropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form array', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls.appProperties).toBeInstanceOf(FormArray);
    expect(component.form.controls.appProperties.length).toBe(0);
  });

  describe('formValueToData', () => {
    it('should convert form array to Record<string, string>', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key1', {nonNullable: true}),
          value: new FormControl<string>('value1', {nonNullable: true}),
        }),
      );
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key2', {nonNullable: true}),
          value: new FormControl<string>('value2', {nonNullable: true}),
        }),
      );

      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {
          key1: 'value1',
          key2: 'value2',
        },
      });
    });

    it('should skip entries with empty key', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('', {nonNullable: true}),
          value: new FormControl<string>('value1', {nonNullable: true}),
        }),
      );
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key2', {nonNullable: true}),
          value: new FormControl<string>('value2', {nonNullable: true}),
        }),
      );

      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {
          key2: 'value2',
        },
      });
    });

    it('should skip entries with empty value', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key1', {nonNullable: true}),
          value: new FormControl<string>('', {nonNullable: true}),
        }),
      );
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key2', {nonNullable: true}),
          value: new FormControl<string>('value2', {nonNullable: true}),
        }),
      );

      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {
          key2: 'value2',
        },
      });
    });

    it('should skip entries with both empty key and value', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('', {nonNullable: true}),
          value: new FormControl<string>('', {nonNullable: true}),
        }),
      );
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key2', {nonNullable: true}),
          value: new FormControl<string>('value2', {nonNullable: true}),
        }),
      );

      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {
          key2: 'value2',
        },
      });
    });

    it('should return empty object when form array is empty', () => {
      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {},
      });
    });

    it('should handle multiple entries with same key (last one wins)', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key1', {nonNullable: true}),
          value: new FormControl<string>('value1', {nonNullable: true}),
        }),
      );
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key1', {nonNullable: true}),
          value: new FormControl<string>('value2', {nonNullable: true}),
        }),
      );

      const result = component.formValueToData();

      expect(result).toEqual({
        appProperties: {
          key1: 'value2',
        },
      });
    });
  });

  describe('dataToFormValue', () => {
    it('should convert Record<string, string> to array format', () => {
      const data = {
        appProperties: {
          key1: 'value1',
          key2: 'value2',
          key3: 'value3',
        },
      };

      const result = component.dataToFormValue(data);

      expect(result).toEqual({
        appProperties: [
          {key: 'key1', value: 'value1'},
          {key: 'key2', value: 'value2'},
          {key: 'key3', value: 'value3'},
        ],
      });
    });

    it('should return empty array when Record is empty', () => {
      const data = {
        appProperties: {},
      };

      const result = component.dataToFormValue(data);

      expect(result).toEqual({
        appProperties: [],
      });
    });

    it('should handle single entry', () => {
      const data = {
        appProperties: {
          key1: 'value1',
        },
      };

      const result = component.dataToFormValue(data);

      expect(result).toEqual({
        appProperties: [{key: 'key1', value: 'value1'}],
      });
    });

    it('should preserve order of keys', () => {
      const data = {
        appProperties: {
          z: 'valueZ',
          a: 'valueA',
          m: 'valueM',
        },
      };

      const result = component.dataToFormValue(data);

      expect(result.appProperties).toHaveLength(3);
      expect(result.appProperties[0]).toEqual({key: 'z', value: 'valueZ'});
      expect(result.appProperties[1]).toEqual({key: 'a', value: 'valueA'});
      expect(result.appProperties[2]).toEqual({key: 'm', value: 'valueM'});
    });
  });

  describe('form validation', () => {
    it('should have valid form when appProperties array is empty', () => {
      expect(component.form.valid).toBe(true);
      expect(component.stepInvalid).toBe(false);
    });

    it('should have valid form when appProperties has valid entries', () => {
      const formArray = component.form.controls.appProperties;
      formArray.push(
        new FormGroup({
          key: new FormControl<string>('key1', {nonNullable: true}),
          value: new FormControl<string>('value1', {nonNullable: true}),
        }),
      );

      expect(component.form.valid).toBe(true);
      expect(component.stepInvalid).toBe(false);
    });
  });
});
