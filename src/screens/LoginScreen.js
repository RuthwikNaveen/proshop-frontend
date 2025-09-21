import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = search ? search.split('=')[1] : '/';

  const { userInfo, loading, error, login, googleLogin } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const googleLoginHandler = () => {
    googleLogin();
  };

  return (
    <Row className='justify-content-md-center mt-5'>
      <Col xs={12} md={6}>
        <h1>Sign In</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          
          <Link to='/forgot-password' style={{ fontSize: '0.9rem', float: 'right' }} className='mt-1'>
            Forgot Password?
          </Link>

          <Button type='submit' variant='primary' className='w-100 mt-3'>
            Sign In
          </Button>
        </Form>
        
        <div className='py-3 text-center'>
            <p>or</p>
            <Button variant='danger' className='w-100 mb-2' onClick={googleLoginHandler}>
                <i className='fab fa-google me-2'></i> Sign In with Google
            </Button>
        </div>

        <Row className='py-3'>
          <Col>
            New Customer?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
              Register
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoginScreen;

