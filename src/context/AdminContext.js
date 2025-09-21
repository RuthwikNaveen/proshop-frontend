import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const getUsers = useCallback(async () => {
    const config = await getConfig();
    if (!config) return;
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  const getOrders = useCallback(async () => {
    const config = await getConfig();
    if (!config) return;
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  const deleteUser = useCallback(
    async (id) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`/api/users/${id}`, config);
        await getUsers();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig, getUsers]
  );

   const deliverOrder = useCallback(
    async (orderId) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        const { data } = await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
        await getOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig, getOrders]
  );
  const deleteOrder = useCallback(
    async (id) => {
      const config = await getConfig();
      if (!config) return;
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`/api/orders/${id}`, config);
        await getOrders();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [getConfig, getOrders]
  );

  return (
    <AdminContext.Provider
      value={{
        users,
        orders,
        loading,
        error,
        getUsers,
        getOrders,
        deleteUser,
        deliverOrder,
        deleteOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;

