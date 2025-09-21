import { useContext, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Badge } from 'react-bootstrap';
import AdminContext from '../context/AdminContext';
import Loader from '../components/Loader';
import Message from '../components/Message';



const OrderListScreen = () => {
  const { orders, loading, error, getOrders, deliverOrder, deleteOrder } = useContext(AdminContext);

  useEffect(() => {
    getOrders();
  }, [getOrders]);
  
  const deliverHandler = (id) => {
    if(window.confirm('Mark this order as delivered?')){
      deliverOrder(id);
    }
  }

  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')){
      deleteOrder(id);
    }
  };

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>STATUS</th> 
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
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
                  {order.returnDetails?.isReturned ? (
                    <Badge bg="danger">Cancelled</Badge>
                  ) : order.isDelivered ? (
                    <Badge bg="success">Delivered</Badge>
                  ) : (
                    <Badge bg="warning">Processing</Badge>
                  )}
                </td>
                <td>
                  <div className='d-flex'>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='light' className='btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                     {order.isPaid && !order.isDelivered && !order.returnDetails?.isReturned && (
                      <Button
                        variant='success'
                        className='btn-sm ms-2'
                        onClick={() => deliverHandler(order._id)}
                      >
                        Mark As Delivered
                      </Button>
                    )}
                    
                    <Button
                      variant='danger'
                      className='btn-sm ms-2'
                      onClick={() => deleteHandler(order._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;

