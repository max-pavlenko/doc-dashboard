export type ConfirmModalData = {
  title: string;
  description: string;
  text?: Record<'confirm' | 'cancel', string>;
  icon?: string;
};
