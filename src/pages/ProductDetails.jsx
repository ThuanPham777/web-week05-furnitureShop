import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addCart, updateCartQuantity } from '../slices/cartSlice';
import Newsletter from '../components/Newsletter';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product;

  const dispatch = useDispatch();

  // Lấy giỏ hàng từ Redux store
  const cart = useSelector((state) => state.cart.items);

  // Cập nhật trạng thái isInCart và quantity
  const initialIsInCart = cart.some((item) => item.id === product.id);
  const initialQuantity = initialIsInCart
    ? cart.find((item) => item.id === product.id).quantity
    : 1;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [isInCart, setIsInCart] = useState(initialIsInCart);

  // Hook useEffect để theo dõi sự thay đổi trong giỏ hàng
  useEffect(() => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      setIsInCart(true);
      setQuantity(cartItem.quantity);
    } else {
      setIsInCart(false);
      setQuantity(1); // Đặt lại số lượng khi sản phẩm không còn trong giỏ hàng
    }
  }, [cart, product.id]);

  const handleAddToCart = () => {
    dispatch(addCart({ ...product, quantity }));
    setIsInCart(true);
  };

  const handleUpdateCartItemQuantity = (id, quantity) => {
    dispatch(updateCartQuantity({ id, quantity }));
  };

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (isInCart) handleUpdateCartItemQuantity(product.id, newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (isInCart) handleUpdateCartItemQuantity(product.id, newQuantity);
    }
  };

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className='w-full h-full flex flex-col items-center py-8'>
      <div className='w-11/12 bg-white shadow-lg rounded-lg overflow-hidden p-8'>
        <div className='flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 w-full space-y-4'>
            <img
              src={product?.images?.[0]}
              alt={product?.name}
              className='w-full h-auto object-cover rounded-lg shadow-md'
            />
            <div className='flex justify-center space-x-4 mt-4'>
              {product.images?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`${product.name} ${index + 1}`}
                  className='w-16 h-16 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105'
                />
              ))}
            </div>
          </div>
          <div className='md:w-1/2 w-full md:ml-8 mt-8 md:mt-0'>
            <h2 className='text-3xl font-bold text-gray-800 mb-4'>
              {product.name}
            </h2>
            <p className='text-lg text-gray-600 mb-4'>{product.description}</p>
            <p className='text-2xl font-bold text-green-600 mb-6'>
              ${product.price}
            </p>

            {/* Quantity Selector */}
            <div className='flex items-center space-x-4 mb-4'>
              <button
                onClick={decrement}
                className='w-10 h-10 bg-lime-600 text-white rounded-md flex items-center justify-center hover:bg-lime-700 transition-colors'
              >
                -
              </button>
              <span className='text-xl'>{quantity}</span>
              <button
                onClick={increment}
                className='w-10 h-10 bg-lime-600 text-white rounded-md flex items-center justify-center hover:bg-lime-700 transition-colors'
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-colors ${
                isInCart
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-lime-500 hover:bg-lime-600'
              }`}
              disabled={isInCart}
            >
              {isInCart ? 'Item in Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className='w-11/12 py-5'>
        <Newsletter />
      </div>
    </div>
  );
};

export default ProductDetails;
