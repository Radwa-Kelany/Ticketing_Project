import buildClient from '../utils/api-requests/build-client';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`tickets/${ticket.id}`}>
            Show Ticket
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <>
    <div className='container p-2'>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/v1/tickets');

  return { tickets: data };
};

export default LandingPage;
