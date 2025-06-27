import authService from "./authService";

export interface PaymentDetails {
  orderId: string;
  amount: string;
  currency: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  userType: string,
  volunteerId: number | null,
  sponsorId: number | null,
  eventId: number,
  isAnnonymous: boolean,
  transactionType: string
}
  
export async function startPayment(details: PaymentDetails) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/start`;
    console.log("Payment API URL:", apiUrl);
    console.log("Payment details:", details);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to generate hash for payment. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    try {
      const data = JSON.parse(responseText);
      const { hash, merchantId } = data;
      return { hash, merchantId };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response");
    }
  } catch (error) {
    console.error("Error in startPayment:", error);
    throw error;
  }
}
  

export async function checkPaymentStatus(orderId: string): Promise<string> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/status/${orderId}`;
    console.log("Payment status API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    console.log("Status check response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Status check error response:", errorText);
      throw new Error(`Failed to fetch payment status. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Status check raw response:", responseText);

    try {
      const data = JSON.parse(responseText);
      const { status } = data;
      return status;
    } catch (parseError) {
      console.error("JSON parse error in status check:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response for status check");
    }
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error);
    throw error;
  }
}


export interface SponsorshipPaymentDetails {
  orderId: string;
  eventTitle: string;
  price: number;
  type: string;
  benefits: string;
  payableAmount: number;
}

export interface SponsorshipPaymentResponse {
  message: string;
  data: SponsorshipPaymentDetails;
}

export async function getSponsorshipPaymentDetails(requestId: number): Promise<SponsorshipPaymentDetails> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sponsorship-requests/sponsor-requests/${requestId}`;
    console.log("Sponsorship payment details API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sponsorship details error response:", errorText);
      throw new Error(`Failed to fetch sponsorship details. Status: ${response.status}, Response: ${errorText}`);
    }

    const responseText = await response.text();

    try {
      const responseData: SponsorshipPaymentResponse = JSON.parse(responseText);
      console.log("Sponsorship details parsed:", responseData);
      
      if (!responseData.data) {
        throw new Error("Invalid response format: missing data field");
      }
      
      return responseData.data;
    } catch (parseError) {
      console.error("JSON parse error in sponsorship details:", parseError);
      console.error("Response was not valid JSON:", responseText);
      throw new Error("Server returned invalid JSON response for sponsorship details");
    }
  } catch (error) {
    console.error("Error in getSponsorshipPaymentDetails:", error);
    throw error;
  }
}