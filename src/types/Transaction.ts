export default interface Transaction {
  dateReceived: Date;
  id: number;
  feeAmount: number;
  success: boolean;
  type: string;
}