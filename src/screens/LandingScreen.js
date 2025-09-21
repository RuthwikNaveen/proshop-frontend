import { Link } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

const LandingScreen = () => {
  return (
    <Container className='text-center mt-5'>
      <Row className='justify-content-md-center'>
        <Col md={8}>
          <h1>Welcome to ProShop Marketplace</h1>
          <p className='lead text-muted'>
            Are you here to buy or to sell? Choose your path below.
          </p>
        </Col>
      </Row>
      <Row className='mt-4'>
        <Col md={6}>
          <Card className='p-4 h-100'>
            <Card.Body className='d-flex flex-column'>
              <h2>I'm a Buyer</h2>
              <p>Browse and purchase amazing products from our sellers.</p>
              <Link to='/shop' className='mt-auto'>
                <Button variant='primary' size='lg' className='w-100'>
                  Start Shopping
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='p-4 h-100'>
            <Card.Body className='d-flex flex-column'>
              <h2>I'm a Seller</h2>
              <p>List your products and manage your inventory in real-time.</p>
              <Link to='/seller' className='mt-auto'>
                <Button variant='success' size='lg' className='w-100'>
                  Go to Dashboard
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingScreen;

