import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { userInfo, getFreshToken } = useContext(AuthContext);

  const getConfig = useCallback(async () => {
    if (!userInfo) return null;
    const token = await getFreshToken();
    if (!token) return null;
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
  }, [userInfo, getFreshToken]);

  const createOrder = useCallback(
    async (orderData) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.post('/api/orders', orderData, config);
        setOrder(data);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const getOrderDetails = useCallback(
    async (id) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const getMyOrders = useCallback(async () => {
    const config = await getConfig();
    if (!config) return;
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders/myorders', config);
      setMyOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  const payOrder = useCallback(
    async (orderId, paymentResult) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.put(
          `/api/orders/${orderId}/pay`,
          paymentResult,
          config
        );
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const deliverOrder = useCallback(
    async (orderId) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.put(
          `/api/orders/${orderId}/deliver`,
          {},
          config
        );
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const returnOrder = useCallback(
    async (orderId, returnReason) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.put(
          `/api/orders/${orderId}/return`,
          { returnReason },
          config
        );
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const createRazorpayOrder = useCallback(
    async (orderId) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/orders/${orderId}/razorpay`,
          config
        );
        return data; // Return the razorpay order details to the component
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const verifyPayment = useCallback(
    async (orderId, paymentResult) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.put(
          `/api/orders/${orderId}/pay`,
          paymentResult,
          config
        );
        setOrder(data); // Update the order state with the paid status
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getConfig]
  );

  const resetOrder = () => {
    setSuccess(false);
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        myOrders,
        success,
        error,
        loading,
        createOrder,
        getOrderDetails,
        getMyOrders,
        resetOrder,
        payOrder,
        deliverOrder,
        returnOrder,
        createRazorpayOrder,
        verifyPayment,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;

