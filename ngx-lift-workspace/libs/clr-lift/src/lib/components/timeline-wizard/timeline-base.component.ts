/* eslint-disable @typescript-eslint/no-explicit-any */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable, of} from 'rxjs';

/**
 * A base class that every step component should extend.
 * This class provides a foundation for creating step components in a timeline-based wizard.
 *
 * Usage Example:
    export class ConfigureDatabaseFormComponent extends TimelineBaseComponent implements AfterViewInit {
      // Step-specific form definition
      override form = new FormGroup({
        database: new FormControl('', {
          validators: [Validators.required],
          asyncValidators: [validateDatabaseNameAvailability(inject(HttpClient))],
        }),
      });

      private timelineWizardService = inject(TimelineWizardService);
      stepData = this.timelineWizardService.getStepData<{database: string}>('configure-database-step-title-or-id');

      // Clicking the next button triggers a POST request. Use timelineWizard service data
      override next$ = inject(HttpClient).post(`/your/api`, {data: this.stepData.data});

      // Clicking the next button triggers a POST request. Use component @Input data, need defer for data to be available
      override next$ = defer(() => inject(HttpClient).post(`/your/api`, {data: this.currentStep.data}));

      ngAfterViewInit() {
        // For async validators' controls, run below because moving between steps needs to update status.
        this.form.controls.database.updateValueAndValidity();
      }
    }

  // Asynchronously validates the uniqueness of the database name using an HTTP request.
  function validateDatabaseNameAvailability(http: HttpClient): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const databaseName = control.value;

      // Return null if the input is empty (no validation needed)
      if (!databaseName) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(300), // Adjust the debounce time as needed
        first(),
        switchMap((databaseName) => {
          return http.get(`https://randomuser.me/api?q=${databaseName}`).pipe(
            map((isAvailable) => (isAvailable ? null : { databaseNameTaken: true })),
            catchError(() => of({ databaseNameTaken: true })),
          );
        }),
      );
    };
  }
 */
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.Default,
})
export abstract class TimelineBaseComponent<StepData = unknown> {
  // These two props are available when ngOnInit, not in the constructor! If data is needed before component initializes, use TimelineWizardService
  @Input() allStepsData: {id: string; data: StepData}[] = []; // all steps data
  @Input() currentStepData: StepData | null = null; // data either input earlier (click next step and then previous step) OR from API

  // Last step may be a review step without a form. ReviewComponent's form = null.
  // Override form for steps needing form action.
  form: FormGroup<any> | null = null;

  // When clicking the NEXT button, this observable will be emitted. Default emits a synchronous observable doing nothing.
  // Override next$ if you'd like to do something like sending an API request.
  next$: Observable<true | unknown> = of(true);

  // By default, if a step form is invalid. stepInvalid is true. Override it if any step needs extra checks.
  // For example, when you have a form control not wrapped in the `form`, and you want to combine form's validity and this control's validity.
  get stepInvalid() {
    return this.form === null ? false : this.form.valid === false;
  }

  /**
   * Converts the step's form value to data. The return value must be the same type as the data passed from timeline inputs.
   * For a simple form, it defaults to emitting the step data form value.
   * For a complex form, override this method and return the shape as the data type passed from timeline inputs.
   * @returns Step data derived from the form value.
   */
  formValueToData() {
    return this.form?.value;
  }

  /**
   * Converts step data to the form value that patchValue uses.
   * @param data Step data, same as the API model.
   * @returns Form value that can be used for patchValue.
   */
  dataToFormValue(data: any): any {
    return data;
  }
}
