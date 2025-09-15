// src/components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  message = "Bạn chắc chắn muốn thực hiện?",
  confirmText = "Xoá",
  cancelText = "Huỷ",
  onConfirm,
  onClose,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border">
          <div className="px-5 pt-4 pb-3 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="px-5 py-4 text-slate-700">{message}</div>
          <div className="px-5 pb-4 border-t bg-slate-50 flex items-center justify-end gap-2">
            <button className="btn" onClick={onClose}>{cancelText}</button>
            <button
              className="btn btn-danger"
              onClick={() => { onConfirm?.(); onClose?.(); }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
