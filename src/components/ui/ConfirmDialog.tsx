import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  children?: ReactNode;
}

const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  children,
}: ConfirmDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] border border-gray-100 animate-in zoom-in-95 duration-300 outline-none p-8 overflow-hidden">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${variant === 'destructive' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}
            >
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-xl font-black text-gray-900 leading-tight mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 text-sm leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all outline-none">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {children && <div className="mt-6">{children}</div>}

          <div className="mt-8 flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
              >
                {cancelText}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className={`px-8 py-3 font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 ${
                variant === 'destructive'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-200 focus:ring-red-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus:ring-indigo-100'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
