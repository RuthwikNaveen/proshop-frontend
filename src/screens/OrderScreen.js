import { useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import OrderContext from '../context/OrderContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import generateInvoice from '../utils/generateInvoice';
import useRazorpay from '../hooks/useRazorpay'; // IMPORTED THE NEW HOOK

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    order,
    loading,
    error,
    getOrderDetails,
    createRazorpayOrder,
    verifyPayment,
  } = useContext(OrderContext);
  const { userInfo } = useContext(AuthContext);

  // THIS IS THE FIX: Use our new hook to track the script loading status
  const isRazorpayLoaded = useRazorpay();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!order || order._id !== orderId) {
      getOrderDetails(orderId);
    }
  }, [order, orderId, getOrderDetails, userInfo, navigate]);

  const payHandler = async () => {
    try {
      const { orderId: razorpayOrderId, amount } = await createRazorpayOrder(order._id);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'ProShop',
        description: `Payment for Order ${order._id}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          await verifyPayment(order._id, response);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#4facfe',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error('Payment failed', err);
    }
  };

  if (loading && !order) return <Loader />;
  if (error) return <Message variant='danger'>{error}</Message>;
  if (!order) return null;

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block w-100'
                    onClick={payHandler}
                    disabled={!isRazorpayLoaded || loading}
                  >
                    {isRazorpayLoaded ? 'Pay with Razorpay' : 'Loading Gateway...'}
                  </Button>
                </ListGroup.Item>
              )}

              {order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block w-100'
                    onClick={() => generateInvoice(order)}
                  >
                    <i className='fas fa-download me-2'></i> Download Invoice
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;

