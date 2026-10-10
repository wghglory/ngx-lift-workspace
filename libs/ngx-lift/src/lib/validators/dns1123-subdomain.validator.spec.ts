import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {dns1123SubdomainValidator, k8sNameValidator} from './dns1123-subdomain.validator';

describe('dns1123-subdomain.validator', () => {
  describe('dns1123SubdomainValidator', () => {
    const validator = dns1123SubdomainValidator();

    it('should return null for empty values', () => {
      expect(validator(new FormControl(''))).toBeNull();
      expect(validator(new FormControl(null))).toBeNull();
    });

    it('should return null for valid subdomain names', () => {
      expect(validator(new FormControl('example.com'))).toBeNull();
      expect(validator(new FormControl('my-cluster.prod.internal'))).toBeNull();
      expect(validator(new FormControl('k8s-01'))).toBeNull();
    });

    it('should return { dns1123Subdomain: true } for invalid formats', () => {
      expect(validator(new FormControl('-invalid'))).toEqual({dns1123Subdomain: true});
      expect(validator(new FormControl('invalid-'))).toEqual({dns1123Subdomain: true});
      expect(validator(new FormControl('invalid_name'))).toEqual({dns1123Subdomain: true});
      expect(validator(new FormControl('name..domain'))).toEqual({dns1123Subdomain: true});
    });

    it('should return { dns1123SubdomainLength: true } when exceeding 253 characters', () => {
      const longDomain = `${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}`;
      expect(validator(new FormControl(longDomain))).toEqual({dns1123SubdomainLength: true});
    });
  });

  describe('k8sNameValidator', () => {
    it('should return null for empty values', () => {
      expect(k8sNameValidator(new FormControl(''))).toBeNull();
    });

    it('should return null for valid Kubernetes names', () => {
      expect(k8sNameValidator(new FormControl('my-app-v1'))).toBeNull();
      expect(k8sNameValidator(new FormControl('postgres-0'))).toBeNull();
    });

    it('should return { k8sName: true } for uppercase, special characters, or dots', () => {
      expect(k8sNameValidator(new FormControl('MyApp'))).toEqual({k8sName: true});
      expect(k8sNameValidator(new FormControl('my.app'))).toEqual({k8sName: true});
      expect(k8sNameValidator(new FormControl('-invalid'))).toEqual({k8sName: true});
    });

    it('should return { k8sName: true } when exceeding 63 characters', () => {
      expect(k8sNameValidator(new FormControl('a'.repeat(64)))).toEqual({k8sName: true});
    });
  });
});
