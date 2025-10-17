import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#2C2C54", backgroundColor: "#FFF" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C2C54",
      }}
      text2Style={{
        fontSize: 14,
        color: "#4B5563",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#2C2C54", backgroundColor: "#FFF0F3" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C2C54",
      }}
      text2Style={{
        fontSize: 14,
        color: "#4B5563",
      }}
    />
  ),
};

export default toastConfig;
