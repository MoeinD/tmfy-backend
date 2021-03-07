import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const orderShow = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState('');

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
                <StripeCheckout />
            </div>
        )
}

orderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default orderShow;