export enum OrderStatus {
  // ticket not reserved yet. the user is still in creating order process, no submit till now
  Created = 'created',
  //   ticket is reserved, order created, the user cancelled the order,
  //   ticket you try to reserved is already reserved
  // the order expire before proceed payment
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete',
}
