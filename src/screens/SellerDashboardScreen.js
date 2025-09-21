import { useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Loader from '../components/Loader';

const SellerDashboardScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/seller');
      return;
    }
    let q;
    if (userInfo.isAdmin) {
      q = query(collection(db, 'products'));
    } else {
      q = query(collection(db, 'products'), where('user', '==', userInfo.uid));
    }
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sellerProducts = [];
      querySnapshot.forEach((doc) => {
        sellerProducts.push({ id: doc.id, ...doc.data() });
      });
      setProducts(sellerProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userInfo, navigate]);

  const handleShow = (product = null) => {
    setCurrentProduct(product);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentProduct(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { name, price, image, brand, category, countInStock, description } = e.target.elements;
    const productData = {
      name: name.value,
      price: Number(price.value),
      image: image.value || '/images/sample.jpg',
      brand: brand.value,
      category: category.value,
      countInStock: Number(countInStock.value),
      description: description.value,
      user: userInfo.uid,
      rating: currentProduct?.rating || 0,
      numReviews: currentProduct?.numReviews || 0,
    };

    if (currentProduct) {
      const productRef = doc(db, 'products', currentProduct.id);
      await updateDoc(productRef, productData);
    } else {
      await addDoc(collection(db, 'products'), productData);
    }
    handleClose();
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")){
       await deleteDoc(doc(db, "products", id));
    }
  };

  const handleDeleteAllFromDatabase = async () => {
    if (window.confirm("ADMIN ACTION: Are you sure you want to delete EVERY product from the database? This is irreversible.")) {
      console.log("Deleting all products from database...");
      const querySnapshot = await getDocs(collection(db, "products"));
      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
      }
      console.log("Database cleared of products!");
      alert("All products have been deleted from the database.");
    }
  };

  if (loading || !userInfo) return <Loader />;

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>{userInfo.isAdmin ? 'All Products (Admin)' : 'My Products'}</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={() => handleShow()}>
            <i className='fas fa-plus'></i> Add Product
          </Button>
          {userInfo && userInfo.isAdmin && (
            <Button variant="danger" className='my-3 ms-2' onClick={handleDeleteAllFromDatabase}>
              <i className='fas fa-skull-crossbones'></i> Nuke All Products
            </Button>
          )}
        </Col>
      </Row>

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>NAME</th>
            <th>PRICE</th>
            <th>OWNER (EMAIL)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{userInfo.isAdmin ? 'Various' : userInfo.email}</td>
              <td>
                <Button variant='light' className='btn-sm' onClick={() => handleShow(product)}>
                  <i className='fas fa-edit'></i>
                </Button>
                <Button variant='danger' className='btn-sm ms-2' onClick={() => handleDelete(product.id)}>
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId='name' className='mb-3'>
              <Form.Label>Name</Form.Label>
              <Form.Control type='text' defaultValue={currentProduct?.name} required />
            </Form.Group>
            <Form.Group controlId='price' className='mb-3'>
              <Form.Label>Price</Form.Label>
              <Form.Control type='number' defaultValue={currentProduct?.price} required />
            </Form.Group>
             <Form.Group controlId='image' className='mb-3'>
              <Form.Label>Image URL</Form.Label>
              <Form.Control type='text' defaultValue={currentProduct?.image} />
            </Form.Group>
            <Form.Group controlId='brand' className='mb-3'>
              <Form.Label>Brand</Form.Label>
              <Form.Control type='text' defaultValue={currentProduct?.brand} required />
            </Form.Group>
             <Form.Group controlId='category' className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control type='text' defaultValue={currentProduct?.category} required />
            </Form.Group> {/* <-- THIS IS THE FIX */}
            <Form.Group controlId='countInStock' className='mb-3'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control type='number' defaultValue={currentProduct?.countInStock} required />
            </Form.Group>
            <Form.Group controlId='description' className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control as='textarea' rows={3} defaultValue={currentProduct?.description} required />
            </Form.Group>
            <Button variant="primary" type="submit" className='mt-3'>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SellerDashboardScreen;

