import { Subjects } from "./subjects";
export interface VoucherUpdatedEvent {
  subject: Subjects.VoucherUpdated;
  data: {
    id: string;
    code: string;
    expireAt: Date;
    amount: number;
  };
}
