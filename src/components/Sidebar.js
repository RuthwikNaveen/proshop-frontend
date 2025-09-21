import { Form } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { CATEGORIES } from '../constants';
import './Sidebar.css';

const Sidebar = ({
  sortKey,
  setSortKey,
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  maxPrice,
}) => {
  return (
    <div className='sidebar-container'>
      <h4>Sort By</h4>
      <Form.Select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        className='mb-4'
      >
        <option value='default'>Default</option>
        <option value='price-asc'>Price: Low to High</option>
        <option value='price-desc'>Price: High to Low</option>
      </Form.Select>

      <h4>Categories</h4>
      <div className='category-filters mb-4'>
        {CATEGORIES.map((category) => (
          <Form.Check
            type='checkbox'
            id={`category-${category}`}
            label={category}
            key={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryChange(category)}
          />
        ))}
      </div>

      <h4>Price Range</h4>
      <div className='price-slider'>
        <Slider
          range
          min={0}
          max={maxPrice}
          defaultValue={[0, maxPrice]}
          onChange={(value) => setPriceRange(value)}
          tipFormatter={(value) => `$${value}`}
        />
        <div className='price-slider-labels'>
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
