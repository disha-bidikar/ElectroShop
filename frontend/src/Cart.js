import { useEffect, useState } from "react";

function Cart({ user, goBack }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/cart/${user.id}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [user.id]);

  const removeItem = (id) => {
    fetch(`http://localhost:8080/cart/${id}`, {
      method: "DELETE"
    }).then(() => {
      setItems(items.filter(item => item.id !== id));
    });
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <button className="back-btn" onClick={goBack}>← Back</button>

      <h2 className="cart-title">🛒 Your Cart</h2>

      {items.length === 0 ? (
        <p className="empty">No items in cart</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-card" key={item.id}>

                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />

                <div className="cart-info">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p>₹{item.product.price}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>

          <div className="cart-footer">
            <h3>Total: ₹{total}</h3>
            <button className="checkout">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;