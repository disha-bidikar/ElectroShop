import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Cart from "./Cart";

function App() {

  // ✅ ALL STATES AT TOP (VERY IMPORTANT)
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200000);

  // 🔥 Fetch products
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  // 🛒 Add to cart
  const addToCart = (productId) => {
  fetch("http://localhost:8080/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: user.id,
      product: { id: productId },   // ✅ FIXED
      quantity: 1
    })
  })
    .then(() => alert("Added to cart ✅"))
    .catch(() => alert("Error ❌"));
};

  // 🔐 LOGIN / REGISTER SCREEN
  if (!user) {
    if (showRegister) {
      return <Register goToLogin={() => setShowRegister(false)} />;
    }

    return (
      <Login
        setUser={setUser}
        goToRegister={() => setShowRegister(true)}
      />
    );
  }

  // 🛒 CART SCREEN
  if (showCart) {
    return <Cart user={user} goBack={() => setShowCart(false)} />;
  }

  // 🔍 FILTER PRODUCTS
  const filteredProducts = products.filter((item) =>
    (category === "All" || item.category === category) &&
    item.price <= maxPrice &&
    (item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()))
  );

  // 🏠 MAIN UI
  return (
    <div className="app">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>🛒 ElectroShop</h2>

        <input
          placeholder="Search gadgets..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowCart(true)}>
          Cart
        </button>
      </div>

      <div className="main">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>Filters</h3>

          <label>Category</label>
          <select onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            <option>Mobile</option>
            <option>Laptop</option>
            <option>Accessories</option>
            <option>Wearable</option>
            <option>Gaming</option>
          </select>

          <label>Max Price: ₹{maxPrice}</label>
          <input
            type="range"
            min="1000"
            max="200000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        {/* PRODUCTS */}
        <div className="products">
          {filteredProducts.map((item) => (
            <div className="card" key={item.id}>

  <img
    src={item.imageUrl || "https://via.placeholder.com/150"}
    alt={item.name}
    style={{ width: "120px", height: "120px", objectFit: "contain" }}
  />

  <h3>{item.name}</h3>
  <p>{item.brand}</p>

  {/* ✅ ADD THIS */}
  <p style={{ fontSize: "12px", opacity: "0.7" }}>
    {item.description}
  </p>

  <p>₹{item.price}</p>

  <button onClick={() => addToCart(item.id)}>
    Add to Cart
  </button>

</div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;