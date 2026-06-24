// client/src/services/payment.service.js
import api from "@/lib/axios";

export const createCheckout = async (tierId) => {
  const response = await api.post(
    "/payments/checkout", // FIX: Match your backend routes file
    { tierId }
  );

  return response.data; // Will return { success: true, data: { url } }
};
