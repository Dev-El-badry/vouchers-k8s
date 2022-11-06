import { Subjects } from "./subjects";
export interface VoucherCreatedEvent {
  subject: Subjects.VoucherCreated;
  data: {
    id: string;
    code: string;
    expireAt: Date;
    amount: number;
  };
}
