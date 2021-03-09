import { useState, useEffect } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';



const orderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push(`/orders`)
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, [order])

    if (timeLeft < 0) {
        return <h4>Order Expired</h4>
    } else
        return (
            <div>
                <h1>{order.id}</h1>
                <h2>{order.status}</h2>
                <h4>Time left to pay: {timeLeft} seconds</h4>

                <StripeCheckout
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                    token={({ id }) => doRequest({ token: id })}
                    stripeKey="pk_test_51IQAFqDQpPWenNPa3Cz24SSumSnJZVDpfHwq40YN2DchIQJTaCrwY3pyul9BIKkUOC9hfV67SuPS7yztu9nrJ1q300J2eCMmjG"
                />
            </div>
        )
}

orderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default orderShow;