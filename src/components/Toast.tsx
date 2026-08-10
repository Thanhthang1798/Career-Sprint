import { Zap } from "lucide-react";
import { cn } from "../utils/cn";

export interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
  xpValue?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-4 w-full max-w-sm rounded-xl bg-white p-4 shadow-2xl border border-slate-100",
        "animate-in slide-in-from-bottom-5 fade-in duration-300"
      )}
      onClick={() => onClose(toast.id)}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full">
        <Zap className="w-6 h-6 fill-amber-500 text-amber-500" />
      </div>
      <div className="flex-1">
        {toast.xpValue !== undefined && (
          <p className="text-lg font-black text-slate-900 leading-tight">+{toast.xpValue} XP</p>
        )}
        <p className={cn("font-semibold text-slate-500", toast.xpValue !== undefined ? "text-sm" : "text-base")}>{toast.title}</p>
        {!toast.xpValue && <p className="text-sm text-slate-400">{toast.subtitle}</p>}
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }: { toasts: ToastMessage[]; onClose: (id: string) => void }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 flex flex-col gap-3 pointer-events-none w-full sm:w-auto items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
