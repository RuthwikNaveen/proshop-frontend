import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from '../context/AuthContext';
import OrderContext from '../context/OrderContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const { myOrders, loading, error, getMyOrders } = useContext(OrderContext);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      getMyOrders();
    }
  }, [userInfo, navigate, getMyOrders]);

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {/* The form has been replaced with a simple display of user info */}
        <p className='mt-3'>
          <strong>Name: </strong> {userInfo?.name}
        </p>
        <p>
          <strong>Email: </strong> {userInfo?.email}
        </p>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      new Date(order.paidAt).toLocaleDateString()
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toLocaleDateString()
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;

