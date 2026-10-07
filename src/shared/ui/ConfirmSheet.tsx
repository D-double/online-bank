import { useTranslation } from 'react-i18next';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';

interface ConfirmSheetProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmSheet = ({ open, title, message, confirmLabel, onConfirm, onClose }: ConfirmSheetProps) => {
  const { t } = useTranslation();

  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      <p className="mb-6 text-fg-soft">{message}</p>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </BottomSheet>
  );
};
