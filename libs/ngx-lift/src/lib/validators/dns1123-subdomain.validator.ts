import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const DNS1123_SUBDOMAIN_MAX_LENGTH = 253;
export const DNS1123_LABEL_MAX_LENGTH = 63;

const DNS1123_LABEL_PATTERN = '[a-z0-9]([-a-z0-9]*[a-z0-9])?';
const DNS1123_SUBDOMAIN_REGEX = new RegExp(`^${DNS1123_LABEL_PATTERN}(\\.${DNS1123_LABEL_PATTERN})*$`);
const K8S_NAME_REGEX = new RegExp(`^${DNS1123_LABEL_PATTERN}$`);

/**
 * Validates that a string conforms to the RFC 1123 DNS subdomain specification
 * (standard format used for Kubernetes resource subdomains).
 *
 * Rules:
 * - Maximum 253 characters total.
 * - Dot-separated labels of maximum 63 characters each.
 * - Consists of lowercase alphanumeric characters and hyphens `'-'`.
 * - Begins and ends with an alphanumeric character.
 *
 * @param ignoreCase When `true` (default), case is ignored before regex verification.
 * @returns A `ValidatorFn` returning `{ dns1123SubdomainLength: true }` if too long,
 * `{ dns1123Subdomain: true }` if format fails, or `null` if valid.
 *
 * @example
 * ```typescript
 * const domainControl = new FormControl('my-cluster.example.com', [dns1123SubdomainValidator()]);
 * ```
 */
export function dns1123SubdomainValidator(ignoreCase = true): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (typeof value !== 'string' || !value) {
      return null;
    }

    if (value.length > DNS1123_SUBDOMAIN_MAX_LENGTH) {
      return {dns1123SubdomainLength: true};
    }

    const testValue = ignoreCase ? value.toLowerCase() : value;
    if (!DNS1123_SUBDOMAIN_REGEX.test(testValue)) {
      return {dns1123Subdomain: true};
    }

    return null;
  };
}

/**
 * Validates that a control value is a valid Kubernetes resource name (RFC 1123 label).
 *
 * Rules:
 * - Maximum 63 characters.
 * - Lowercase alphanumeric characters or hyphens `'-'`.
 * - Starts and ends with an alphanumeric character.
 *
 * @param control The Angular form control to validate.
 * @returns `{ k8sName: true }` if invalid, or `null` if valid.
 *
 * @example
 * ```typescript
 * const podName = new FormControl('frontend-service-0', [k8sNameValidator]);
 * ```
 */
export function k8sNameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (typeof value !== 'string' || !value) {
    return null;
  }

  if (value.length > DNS1123_LABEL_MAX_LENGTH || !K8S_NAME_REGEX.test(value)) {
    return {k8sName: true};
  }

  return null;
}
