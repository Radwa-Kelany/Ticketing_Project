import { Stan } from "node-nats-streaming";
import Publisher from "../basics/base-publisher";
import { PaymentCreatedEvent } from "../basics/payment-create-event";
import { Subjects } from "../basics/subjects";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject= Subjects.PaymentCreated;
    constructor(client:Stan){
        super(client)
    }
}