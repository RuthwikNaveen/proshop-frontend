import { useState, useContext } from 'react';
import { Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Rating from './Rating';

const ProductReviews = ({ reviews, onSubmitReview, onDeleteReview }) => {
  const { userInfo } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Please select a rating and write a comment.');
      return;
    }
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className='my-4'>
      <h2>Reviews</h2>
      {reviews.length === 0 && <Alert variant='info'>No Reviews</Alert>}
      <ListGroup variant='flush'>
        {reviews.map((review) => (
          <ListGroup.Item key={review.createdAt}>
            <div className='d-flex justify-content-between'>
              <strong>{review.name}</strong>
              {/* THIS IS THE FIX: Show delete button if user is author OR admin */}
              {userInfo && (userInfo.uid === review.user || userInfo.isAdmin) && (
                <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => onDeleteReview(review)}
                >
                  <i className='fas fa-trash'></i>
                </Button>
              )}
            </div>
            <Rating value={review.rating} />
            <p>{new Date(review.createdAt).toLocaleDateString()}</p>
            <p>{review.comment}</p>
          </ListGroup.Item>
        ))}
        <ListGroup.Item>
          <h2>Write a Customer Review</h2>
          {userInfo ? (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='rating' className='my-2'>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as='select'
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value='0'>Select...</option>
                  <option value='1'>1 - Poor</option>
                  <option value='2'>2 - Fair</option>
                  <option value='3'>3 - Good</option>
                  <option value='4'>4 - Very Good</option>
                  <option value='5'>5 - Excellent</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='comment' className='my-2'>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as='textarea'
                  row='3'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>
              <Button type='submit' variant='primary' className='mt-3'>
                Submit
              </Button>
            </Form>
          ) : (
            <Alert variant='warning'>
              Please <Link to='/login'>sign in</Link> to write a review
            </Alert>
          )}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default ProductReviews;

