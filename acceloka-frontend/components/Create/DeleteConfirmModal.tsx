"use client";

import React from "react";
import { Modal } from "antd";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { DeleteConfirmModalProps } from "@/types/api";

export function DeleteConfirmModal({
  isOpen,
  ticketCode,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      centered
      closable={false}
      width={400}
    >
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <WarningCircleIcon size={80} weight="fill" className="text-warning" />
        <h2 className="text-2xl font-bold text-dark-1 font-heading">
          Are you sure?
        </h2>
        <p className="text-dark-3 font-body">
          Do you really want to delete ticket{" "}
          <span className="font-bold text-dark-1">{ticketCode}</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-full font-bold text-dark-3 border-2 border-dark-4 hover:bg-dark-4/10 transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-full font-bold text-white bg-error hover:opacity-90 transition-all cursor-pointer active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
