import { useEffect, useState, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const HomeScreen = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortKey, setSortKey] = useState('default');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData = [];
        let maxPriceFound = 0;
        snapshot.forEach((doc) => {
          const product = { _id: doc.id, ...doc.data() };
          productsData.push(product);
          if (product.price > maxPriceFound) {
            maxPriceFound = product.price;
          }
        });
        setAllProducts(productsData);
        setMaxPrice(Math.ceil(maxPriceFound));
        setPriceRange([0, Math.ceil(maxPriceFound)]);
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (category) => {

    if (keyword) {
      navigate('/shop');
    }

    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const displayedProducts = useMemo(() => {
    let products = [...allProducts];
    if (keyword) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      products = products.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (sortKey === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortKey === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [allProducts, sortKey, selectedCategories, priceRange, keyword]);

  return (
    <Row className='mt-4'>
      <Col md={3}>
        <Sidebar
          sortKey={sortKey}
          setSortKey={setSortKey}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
        />
      </Col>
      <Col md={9}>
        {keyword ? (
          <h1>Search Results for "{keyword}"</h1>
        ) : !selectedCategories.length ? (
          <h1>Latest Products</h1>
        ) : (
          <h1>Filtered Products</h1>
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Row>
            {displayedProducts.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default HomeScreen;

