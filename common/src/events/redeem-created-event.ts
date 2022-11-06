import { Subjects } from "./subjects";
export interface RedeemCreatedEvent {
  subject: Subjects.RedeemCreated;
  data: {
    id: string;
    userId: string;
    voucher: {
      id: string;
      amount: number;
    };
  };
}
