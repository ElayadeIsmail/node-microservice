import { Ticket } from '../Ticket';

it('implement optimistic concurrency control', async () => {
  // ! create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 15,
    userId: 'AZD34',
  });
  // ! Save the ticket to the database
  await ticket.save();

  // ! Fetch ticket from database twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // ! Make separate change to the tickets instance
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  // ! save the first fetched ticket
  await firstInstance!.save();
  // ! save he second  fetched ticket and expect an error
  await expect(async () => {
    await secondInstance!.save();
  }).rejects.toThrowError();
});

it('increment version number after multiple saving', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'AZ12Q',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
