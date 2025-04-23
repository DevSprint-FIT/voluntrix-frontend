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
  userType: string,
  volunteerId: number | null,
  sponsorId: number | null,
  eventId: number,
  isAnnonymous: boolean,
  transactionType: string
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
  

export async function checkPaymentStatus(orderId: string): Promise<string> {
  try {
    const response = await fetch(`${backendUrl}/api/payment/status/${orderId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch payment status.");
    }

    const { status } = await response.json();
    return status;
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
    throw error;
  }
}
