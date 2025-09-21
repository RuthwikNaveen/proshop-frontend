import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import CartContext from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import './PaymentScreen.css';

const PaymentScreen = () => {
  const { shippingAddress, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiApp, setUpiApp] = useState('GooglePay');
  const [savedCards, setSavedCards] = useState([
    { id: '1', type: 'Visa', last4: '1234', expiry: '12/25' },
    { id: '2', type: 'Mastercard', last4: '5678', expiry: '08/26' },
  ]);
  const [selectedCard, setSelectedCard] = useState('1');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod === 'UPI' ? upiApp : `Card ending in ${savedCards.find(c => c.id === selectedCard)?.last4}`);
    navigate('/placeorder');
  };

  const handleAddCard = (newCard) => {
    setSavedCards([...savedCards, { id: Date.now().toString(), ...newCard }]);
    setShowModal(false);
  };

  return (
    <div className='payment-container'>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="payment-section">
          <h4>UPI</h4>
          <div className={`payment-option ${paymentMethod === 'UPI' && upiApp === 'GooglePay' ? 'selected' : ''}`} onClick={() => {setPaymentMethod('UPI'); setUpiApp('GooglePay')}}>
             <i className="fab fa-google-pay fa-2x me-3"></i>
             <strong>Google Pay</strong>
          </div>
           <div className={`payment-option ${paymentMethod === 'UPI' && upiApp === 'PhonePe' ? 'selected' : ''}`} onClick={() => {setPaymentMethod('UPI'); setUpiApp('PhonePe')}}>
              <i className="fas fa-mobile-alt fa-2x me-3"></i>
             <strong>PhonePe</strong>
          </div>
        </div>
        
        <div className="payment-section">
          <h4>Credit/Debit Card</h4>
          {savedCards.map(card => (
             <div key={card.id} className={`payment-option saved-card-item ${paymentMethod === 'Card' && selectedCard === card.id ? 'selected' : ''}`} onClick={() => {setPaymentMethod('Card'); setSelectedCard(card.id)}}>
               <div className="card-details">
                 <i className="far fa-credit-card fa-lg me-3"></i>
                 <span>{card.type} ending in {card.last4}</span>
               </div>
            </div>
          ))}
          <Button variant="outline-primary" className="w-100 mt-2" onClick={() => setShowModal(true)}>
             <i className="fas fa-plus me-2"></i> Add New Card
          </Button>
        </div>

        <Button type='submit' variant='primary' className='mt-3 w-100 btn-continue'>
          Continue
        </Button>
      </Form>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
         <Modal.Header closeButton>
           <Modal.Title>Add a New Card</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <Form onSubmit={(e) => { e.preventDefault(); handleAddCard({type: 'Visa', last4: e.target.elements.cardNumber.value.slice(-4), expiry: e.target.elements.expiry.value}) }}>
             <Form.Group controlId="cardNumber" className="mb-3">
               <Form.Label>Card Number</Form.Label>
               <Form.Control type="text" placeholder="Enter card number" required />
             </Form.Group>
             <Form.Group controlId="expiry" className="mb-3">
               <Form.Label>Expiry Date (MM/YY)</Form.Label>
               <Form.Control type="text" placeholder="MM/YY" required />
             </Form.Group>
              <Form.Group controlId="cvv" className="mb-3">
               <Form.Label>CVV</Form.Label>
               <Form.Control type="text" placeholder="CVV" required />
             </Form.Group>
             <Button variant="primary" type="submit">Save Card</Button>
           </Form>
         </Modal.Body>
       </Modal>
    </div>
  );
};

export default PaymentScreen;

