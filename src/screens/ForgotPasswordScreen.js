import { useState, useContext } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { loading, error, resetPassword } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
    }
  };

  return (
    <Row className='justify-content-md-center mt-5'>
      <Col xs={12} md={6}>
        <h1>Forgot Password</h1>
        <p>Enter your email address and we will send you a link to reset your password.</p>
        {message && <Alert variant='success'>{message}</Alert>}
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
              required
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='w-100 mt-3'>
            Send Reset Email
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default ForgotPasswordScreen;
