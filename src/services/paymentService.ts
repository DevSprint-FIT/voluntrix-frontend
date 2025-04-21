const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface PaymentDetails {
    orderId: string;
    amount: string;
    currency: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }
  
  export async function startPayment(details: PaymentDetails) {
    try {
      const response = await fetch(`${backendUrl}/api/payment/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate hash for payment.");
      }
  
      const { hash, merchantId } = await response.json();
      return { hash, merchantId };
    } catch (error) {
      console.error("Error in startPayment:", error);
      throw error;
    }
}
  