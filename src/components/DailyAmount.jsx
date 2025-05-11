import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios';

function DailyAmount() {
  const [alldailypayments, setalldailypayments]=useState([]);
  const [alldailyorders, setalldailyorders]=useState([]);

  useEffect(()=>{
    fetchallpayments();
    fetchorders();

  },[]);

  
  const today = new Date().toLocaleDateString('en-CA');
  

  
  let totalreceivedamount=0;
  alldailypayments.forEach(payment => {
  totalreceivedamount += Number(payment.amount);
    
  });
  
  const fetchallpayments= async() => 
    {
        try{
          await axiosInstance.get(`/payments?date=${today}`)
          .then(res=>setalldailypayments(res.data));
        }
        catch(err){
          console.log(err);
        }
  };

 const fetchorders = async () =>
 {
     try
     {
       await axiosInstance.get(`/orders?date=${today}`)
       .then(res=>{
        setalldailyorders(res.data);
        console.log((res.data)); 
     });
     }
     catch(error){
      console.log(error);
     }

 };

let totalamount=0;

//to be changed

let todayorders=alldailyorders.filter(order=>order.orderdate.startsWith(today));
todayorders.forEach(order => {
    totalamount= (Number(order.price) * Number(order.quantity) + totalamount );
    
 });
  


    
  return (
    
    


    <>
    <div className="col-xl-3 col-md-6">
                <div className="card prod-p-card bg-c-blue">
                  <div className="card-body">
                    <div className="row align-items-center m-b-25">
                      <div className="col">
                        <h6 className="m-b-5 text-white">Total Amount</h6>
                        <h3 className="m-b-0 text-white">${totalamount}</h3>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-money-bill-alt text-c-lue f-18" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card prod-p-card bg-c-green">
                  <div className="card-body">
                    <div className="row align-items-center m-b-25">
                      <div className="col">
                        <h6 className="m-b-5 text-white">Received Amount</h6>
                        <h3 className="m-b-0 text-white">${totalreceivedamount}</h3>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-dollar-sign text-c-green f-18" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card prod-p-card bg-c-yellow">
                  <div className="card-body">
                    <div className="row align-items-center m-b-25">
                      <div className="col">
                        <h6 className="m-b-5 text-white">Pending Amount</h6>
                        <h3 className="m-b-0 text-white">123</h3>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-credit-card text-c-yellow f-18" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="card prod-p-card bg-c-red">
                  <div className="card-body">
                    <div className="row align-items-center m-b-25">
                      <div className="col">
                        <h6 className="m-b-5 text-white">Cancelled Amount</h6>
                        <h3 className="m-b-0 text-white">6,784</h3>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-credit-card text-c-red f-18" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    </>
  )
}

export default DailyAmount