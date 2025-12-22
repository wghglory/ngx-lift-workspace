export type CertificateStatus = {
  labelText: string;
  labelClass: string;
  status: 'info' | 'success' | 'warning' | 'danger';
  shape: 'error-standard' | 'exclamation-triangle' | 'success-standard';
};
