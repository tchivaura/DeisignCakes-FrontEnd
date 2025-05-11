import React from 'react';
import { BrowserRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import Login from './defaults/Login';
import Dashboard from './defaults/Dashboard';
import CreateUser from './defaults/CreateUser';
import Header from './components/Header';
import SideNav from './components/SideNav';
import Users from './defaults/Users';
import Customers from './defaults/Customers';
import EditCustomer from './defaults/EditCustomer';
import OrderCreation from './defaults/OrderCreation';
import AllOrders from './defaults/AllOrders';
import { useEffect } from 'react';
import PaymentCreation from './defaults/PaymentCreation';
import Products from './defaults/Products';
import PaymentTypes from './defaults/PaymentTypes';
import AllPayments from './defaults/Allpayments';
import ProductPricing from './defaults/ProductPricing';


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  let role=null;
  

  useEffect(() => {
    // If not logged in and not already on login page, redirect to login
    if (!window.localStorage.getItem("loggedin") && !isLoginPage) {
      
      navigate("/login");
    }
   
   // console.log(window.localStorage.getItem("role"));
  }, [navigate, location.pathname]);  // watch for changes

  return (
    <div>
      {!isLoginPage && <SideNav role={localStorage.getItem("role")}/>}
      {!isLoginPage && <Header />}

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/createuser' element={<CreateUser />} />
        <Route path='/users' element={<Users />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/editcustomer/:id' element={<EditCustomer />} />
        <Route path='/ordercreation' element={<OrderCreation />} />
        <Route path='/allorders' element={<AllOrders />} />
        <Route path='/paymentcreation' element={<PaymentCreation />} />
        <Route path='/products' element={<Products />} />
        <Route path='/paymenttypes' element={<PaymentTypes />} />
        <Route path='/allpayments' element={<AllPayments />} />
        <Route path='/productsprice' element={<ProductPricing />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
