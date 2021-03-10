const OrderIndex = ({ orders }) => {

    const orderList = orders.map(order => {
        return <li key={order.id}>{order.ticket.title} - {order.status}</li>
    })
    return <div>
        <h1>Order list</h1>
        <ul>
            {orderList}
        </ul>

    </div>
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };

}

export default OrderIndex;