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
import BasicCustomerDetails from './components/BasicCustomerDetails';
import NewCustomer from './defaults/NewCustomer';
import CustomerComplaints from './defaults/CustomerComplaints';
import Expenses from './defaults/Expenses';

import AllFinances from './defaults/AllFinances';
import Suppliers from './defaults/Suppliers';


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  let role=null;
  

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedin") === "true";
  
    if (!isLoggedIn && !isLoginPage) {
      navigate("/login");
    }
  }, [navigate, location.pathname]);
  

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
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/BasicCustomerDetails" element={<BasicCustomerDetails />} />
        <Route path="/complains" element={<CustomerComplaints />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/alltransactions" element={<AllFinances/>} />
        <Route path="/suppliers" element={<Suppliers/>} />
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
