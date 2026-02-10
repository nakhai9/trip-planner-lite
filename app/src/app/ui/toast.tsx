import { Alert, Snackbar } from "@mui/material";
type ToastProps = {
  isShow: boolean;
  type: "success" | "error" | "warning" | "info";
  message: any;
  onClose?: () => void;
};
export default function Toast({
  isShow = false,
  type = "success",
  message,
  onClose,
}: ToastProps) {
  return (
    <Snackbar
      open={isShow}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
