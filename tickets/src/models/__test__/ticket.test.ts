import Ticket from '../ticket.model';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'Movie',
    price: 120,
    userId: '123',
  });
  await ticket.save();
  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket?.set({ price: 200 });
  secondTicket?.set({ price: 300 });
  await firstTicket?.save();

  try {
    await secondTicket?.save();
  } catch (error) {
    return;
  }
  throw new Error('if success not reach here');
});
