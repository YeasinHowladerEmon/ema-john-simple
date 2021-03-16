import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, processOrder, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';
import happyImage from '../../images/giphy.gif';
import { useHistory } from 'react-router';

const Review = () => {
    const [cart, setCart] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const history = useHistory()

    const handleProccedCheckout = () => {
       history.push('/shipment')
    }

    const removeProduct = (productKey) => {
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(() => {
        //cart
        const saveCart = getDatabaseCart();
        const productKeys = Object.keys(saveCart);
        const cartProducts = productKeys.map(key => {
            const product = fakeData.find(pd => pd.key === key);
            product.quantity = saveCart[key];
            return product;
        })

        setCart(cartProducts);
    }, [])

    let thankyou;
     if(orderPlaced){
        //   thankyou = <img src={happyImage} alt=""/>
    }
    return (
        <div className ="twin-container">  
          <div className ="product-container">
            {
                cart.map(pd =>  <ReviewItem 
                    removeProduct = {removeProduct}
                    key={pd.key}
                    product={pd}></ReviewItem>)
            }
            {
                thankyou
            }
          </div>
          <div className="cart-container">
                <Cart cart={cart}>
                    <button onClick={handleProccedCheckout} className="name-button">Procced checkout</button>
                </Cart>
          </div>
        </div>
    );
};

export default Review;<h1>hello world!</h1>