
import buildClient from '../../utils/api-requests/build-client';
import useRequest from '../../utils/hooks/use-request';
import  Router  from 'next/router'
const ShowTicket = ({ ticket}) => {
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/v1/orders',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
    
  });

  return (
    <div className='container-sm p-5'>
      <h1>{ticket.title}</h1>
      <h2>Price: {ticket.price}</h2>
      {errors}
      <button  onClick={()=>doRequest()} className="btn btn-primary">Purchase</button>
    </div>
  );
};

ShowTicket.getInitialProps = async (context) => {
  const {ticketId} = context.query;
  const client = buildClient(context);
  const { data } = await client.get(`/api/v1/tickets/${ticketId}`);
  return { ticket: data };
};


export default ShowTicket