
import { Ticket } from "../tickets";

it('implementss optimistic conurrency control', async (done) => {
    //create an insance of a ticket
    const ticket = Ticket.build({
        title: 'test',
        price: 34,
        userId: '234'
    })
    //save the ticket to the database
    await ticket.save();
    //fetch the ticket twice
    const ticket1 = await Ticket.findById(ticket.id);
    const ticket2 = await Ticket.findById(ticket.id);
    //change the first ticket
    ticket1!.set({ price: 40 });
    ticket2.set({ price: 45 });
    await ticket1.save();

    try {
        await ticket2.save();
    }
    catch (err) {
        done();
    }



    //try to fetch the second ticket and got the errror
})

it('increments the versioin number on multiple saves ', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 30,
        userId: 'tedt'
    })

    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})