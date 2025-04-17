import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from '../events/ticketCreatedPublisher'

console.clear()
const stan= nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
})


stan.on('connect',async()=>{
    console.log('Publisher connected to NATS');

 try {
    const data ={
        id:"123",
        title:"movie",
        price: 20,
        userId:"456"
    }
    await new TicketCreatedPublisher(stan).publish(data)
 } catch (error) {
    console.log(error)
 }
})