export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  title: string;
  description: string;
  id?: symbol;
  toastType?: ToastType;

  manualClosable?: boolean;
  timeoutSeconds?: number;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  date?: string;

  closed?: () => void;
  primaryButtonClick?: () => void;
  secondaryButtonClick?: () => void;
};

export type CreatedToast = Required<Pick<Toast, 'title' | 'description' | 'id' | 'toastType'>> & Toast;
