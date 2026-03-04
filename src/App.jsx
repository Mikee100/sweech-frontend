import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderDetails from './pages/OrderDetails'
import Category from './pages/Category'
import Search from './pages/Search'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Favourites from './pages/Favourites'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/AdminLayout'
import ProductList from './pages/Admin/ProductList'
import ProductEdit from './pages/Admin/ProductEdit'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="app">
      <Header isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/search" element={<Search />} />

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="productlist" element={<ProductList />} />
              <Route path="product/create" element={<ProductEdit />} />
              <Route path="product/:id/edit" element={<ProductEdit />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileBottomNav onCartOpen={() => setIsCartOpen(true)} />
    </div>
  )
}

export default App
