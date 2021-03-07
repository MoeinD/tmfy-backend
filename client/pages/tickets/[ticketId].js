import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => console.log('tis is the order ', order)
    })
    return <div>
        <h1>{ticket.title}</h1>
        <h4>{ticket.price}</h4>
        <p>{ticket.orderId}</p>
        {errors}
        <button className="btn btn-primary" onClick={doRequest} >Purchase</button>
    </div>
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    console.log('this is the ticket id ', ticketId);
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
}

export default TicketShow;