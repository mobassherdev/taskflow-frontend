'use client';
import ConfirmDialog from './ConfirmDialog';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this? This action cannot be undone.',
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmLabel="Delete"
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
