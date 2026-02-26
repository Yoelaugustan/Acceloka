"use client";

import React from "react";
import { Modal } from "antd";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { StatusModalProps } from "@/types/api";

export function StatusModal({
  isOpen,
  type,
  title,
  message,
  onClose,
}: StatusModalProps) {
  const isSuccess = type === "success";

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={400}
      styles={{
        body: { padding: "40px 20px" },
      }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {isSuccess ? (
          <CheckCircleIcon size={80} weight="fill" className="text-success" />
        ) : (
          <XCircleIcon size={80} weight="fill" className="text-error" />
        )}

        <h2 className="text-2xl font-bold text-dark-1 font-heading">{title}</h2>

        <p className="text-dark-3 font-body">{message}</p>

        <button
          onClick={onClose}
          className={`mt-6 px-8 py-2 rounded-full font-bold text-white transition-all active:scale-95 cursor-pointer ${
            isSuccess
              ? "bg-success hover:opacity-90"
              : "bg-error hover:opacity-90"
          }`}
        >
          {isSuccess ? "Great!" : "Try Again"}
        </button>
      </div>
    </Modal>
  );
}
