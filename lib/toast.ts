import { toast } from "react-hot-toast";

export type ToastType = "success" | "error";

export default function newToast(message: string, type: ToastType = "success") {
  const fcn = type === "success" ? toast.success : toast.error;

  fcn(message, {
    style: {
      border: "1px solid #262347",
      padding: "12px",
      color: "#A4A1C8",
      fontSize: "12px",
      fontWeight: "500",
      boxShadow: "1px solid #262347",
      background: "rgba(16, 16, 24, 0.95)",
      backdropFilter: "blur(5px)",
    },
  });
}
