// src/types/cardTypes.ts
export type CreditCard = {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "troy" | string;
  holderName: string;
  last4: string;         // keep last4 on the API; avoid sending full PAN
  masked?: string;       // optional (server may send **** **** **** 1234)
  expiresMonth: number;  // 1-12
  expiresYear: number;   // 4-digit
  color?: string;        // optional brand color from server
};

export type BankAccount = {
  id: string;
  bankName: string;
  ibanMasked: string;    // e.g., TR** **** **** **42
  accountHolder: string;
  currency: string;      // TRY, USD, EUR...
  balance?: number;
};