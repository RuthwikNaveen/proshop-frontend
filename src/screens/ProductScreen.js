import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductReviews from '../components/ProductReviews';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ _id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Product not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate(`/cart`);
  };

  const submitReviewHandler = async ({ rating, comment }) => {
    if (!userInfo) {
      alert('You must be logged in to write a review.');
      return;
    }
    try {
      const productRef = doc(db, 'products', productId);

      const newReview = {
        name: userInfo.name,
        rating: Number(rating),
        comment,
        user: userInfo.uid,
        createdAt: new Date().toISOString(),
      };

      await updateDoc(productRef, {
        reviews: arrayUnion(newReview),
      });

      const updatedProductSnap = await getDoc(productRef);
      const updatedProductData = updatedProductSnap.data();
      const updatedReviews = updatedProductData.reviews || [];
      const numReviews = updatedReviews.length;
      const newRating =
        updatedReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

      await updateDoc(productRef, {
        rating: newRating,
        numReviews: numReviews,
      });
      
      setProduct({ _id: updatedProductSnap.id, ...updatedProductData });
      alert('Review submitted!');

    } catch (err) {
      console.error("Error submitting review: ", err);
      alert('Error submitting review.');
    }
  };

  const deleteReviewHandler = async (reviewToDelete) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
          reviews: arrayRemove(reviewToDelete),
        });
        const updatedProductSnap = await getDoc(productRef);
        const updatedProductData = updatedProductSnap.data();
        const updatedReviews = updatedProductData.reviews || [];
        const numReviews = updatedReviews.length;
        const newRating =
          numReviews > 0
            ? updatedReviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
            : 0;

        await updateDoc(productRef, {
          rating: newRating,
          numReviews: numReviews,
        });

        setProduct({ _id: updatedProductSnap.id, ...updatedProductData });
        alert('Review deleted!');
      } catch (err) {
        console.error("Error deleting review: ", err);
        alert('Error deleting review.');
      }
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/shop'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        product && (
          <>
            <Row>
              <Col md={5}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={4}>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      value={product.rating || 0}
                      text={`${product.numReviews} reviews`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>
                          <strong>${product.price}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col>
                            <Form.Control
                              as='select'
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Button
                        className='btn-block'
                        type='button'
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        Add To Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col md={7}>
                <ProductReviews
                  reviews={product.reviews || []}
                  onSubmitReview={submitReviewHandler}
                  onDeleteReview={deleteReviewHandler}
                />
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
};

export default ProductScreen;

