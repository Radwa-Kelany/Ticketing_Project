import { Subjects } from './subjects';
import { OrderStatus } from './orderStatus';

export interface ExpirationCompleteEvent {
    subject:Subjects.ExpirationComplete
    data:{
        id:string
    }
}
