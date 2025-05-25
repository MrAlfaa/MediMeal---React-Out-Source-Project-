export interface PaymentDetails {
  method: 'hospital-account' | 'cash' | 'card';
  amount: number;
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
  hospitalAccountId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  async processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    switch (paymentDetails.method) {
      case 'hospital-account':
        return this.processHospitalAccountPayment(paymentDetails);
      case 'cash':
        return this.processCashPayment(paymentDetails);
      case 'card':
        return this.processCardPayment(paymentDetails);
      default:
        return { success: false, error: 'Invalid payment method' };
    }
  }

  private async processHospitalAccountPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Simulate hospital account validation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (paymentDetails.hospitalAccountId && paymentDetails.hospitalAccountId.length >= 6) {
          resolve({
            success: true,
            transactionId: `HSP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid hospital account ID'
          });
        }
      }, 1000);
    });
  }

  private async processCashPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Cash payments are always successful at order time
    return {
      success: true,
      transactionId: `CASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  private async processCardPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
    // Simulate card payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const { cardDetails } = paymentDetails;
        if (!cardDetails) {
          resolve({ success: false, error: 'Card details are required' });
          return;
        }

        // Basic validation
        if (cardDetails.cardNumber.length < 13 || 
            !cardDetails.expiryMonth || 
            !cardDetails.expiryYear || 
            cardDetails.cvv.length < 3) {
          resolve({ success: false, error: 'Invalid card details' });
          return;
        }

        // Simulate payment success (90% success rate)
        const isSuccess = Math.random() > 0.1;
        if (isSuccess) {
          resolve({
            success: true,
            transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          resolve({
            success: false,
            error: 'Payment declined. Please try again or use a different card.'
          });
        }
      }, 2000);
    });
  }

  validateCardNumber(cardNumber: string): boolean {
    // Basic Luhn algorithm implementation
    const cleanNumber = cardNumber.replace(/\D/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  getCardBrand(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    if (cleanNumber.startsWith('6')) return 'discover';
    
    return 'unknown';
  }
}

export default new PaymentService();