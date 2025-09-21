import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);
  if (loading) {
    return <Loader />;
  }


  if (userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to='/login' replace />;
  }
};

export default PrivateRoute;
