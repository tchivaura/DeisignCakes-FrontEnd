import React, { useState, useEffect } from 'react';
import OrderPayments from './OrderPayments'; // Ensure the path is correct
import axiosInstance from '../api/axios';




function BasicOrderDetails({ Order, ProductSize }) {
  
  const[lovedone,setlovedone]= useState('');

  useEffect (()=>
    {
      lovedonedetails();
    },[]);

    const lovedonedetails= ()=>{axiosInstance.get(`/LovedOnes/lovedoneid/${Order.orderperson}`)
      .then (res=>setlovedone(res.data))};

      
  return (
    <div className="card">
      <div className="card-header"><h5>Basic Order Details</h5></div>
      <div className="card-body">
        <form>
          <div className="row mb-3">
          
            
              <div className="col-md-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={Order.customer.firstName + ' ' + Order.customer.surname}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Order Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="orderid"
                  value={Order.id}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Extra Information</label>
                <input
                  type="text"
                  className="form-control"
                  name="extrainformation"
                  value={Order.extrainstructions}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input
                  type="text"
                  className="form-control"
                  name="price"
                  value={Order.price}
                  readOnly
                />
              </div>
            </div>
            

            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Order For</label>
                <input
                  type="text"
                  className="form-control"
                  name="orderfor"
                  value={(lovedone.fullName==null)?'Self' :lovedone.fullName}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="productname"
                  value={Order.product.productName}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Product Size</label>
                <input
                  type="text"
                  className="form-control"
                  name="productsize"
                  value={ProductSize}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  className="form-control"
                  name="quantity"
                  value={Order.quantity || ''}
                  readOnly
                />
              </div>
            </div>
          
        </form>

       
        <OrderPayments
          orderId={Order.id}
          orderPrice={Order.price}
          orderQuantity={Order.quantity}
        />
      </div>
    </div>
  );
}

export default BasicOrderDetails;
