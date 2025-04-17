import { title } from "process";
import buildClient from "../../utils/api-requests/build-client";
const ShowOrders = ({orders} ) => {
  return (
    <ul>
      <h1>orders</h1>
      {orders.map((order) => {
        return(
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>)
      })}
    </ul>
  );
};

ShowOrders.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/v1/orders');
  return { orders: data};
};

export default ShowOrders