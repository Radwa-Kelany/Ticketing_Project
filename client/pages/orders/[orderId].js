import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../utils/hooks/use-request';
import { useRouter } from 'next/navigation';
import buildClient from '../../utils/api-requests/build-client';

const ShowOrder = ({ order, currentUser }) => {
  const router = useRouter();
  const { errors, doRequest } = useRequest({
    method: 'post',
    url: '/api/v1/payments',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
      router.push('/orders');
    },
  });
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const timerSet = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    timerSet();
    const stopTimer = setInterval(timerSet, 1000);
    return () => {
      clearInterval(stopTimer);
    };
  }, []);
  if (timeLeft < 0) {
    return (
      <div className="container-sm p-5">
        <h1> order of {order.ticket.title} is Expired</h1>;
      </div>
    );
  }
  return (
    <>
      <div className="container p-5">
        <h2>
          Your Order of {order.ticket.title} will expire within {timeLeft}{' '}
          seconds
        </h2>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51Qj1n6C6g6sK3D5gLFdvdSA9HyeZhuCZ4yiJ3SSNg9AgLuo1qVQB7OITNf3mTkRQFQbtoSFbxXaIFHLqQEzZ4hLn00Szl8Y8Qa"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        ></StripeCheckout>
        {errors}
      </div>
    </>
  );
};

ShowOrder.getInitialProps = async (context) => {
  const { orderId } = context.query;
  const client = buildClient(context);
  const { data } = await client.get(`/api/v1/orders/${orderId}`);
  return { order: data[0] };
};

export default ShowOrder;
