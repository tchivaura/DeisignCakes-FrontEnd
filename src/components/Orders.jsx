import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const today = new Date().toLocaleDateString('en-CA');

  const todayOrders = orders.filter(order => order.orderdate.startsWith(today));

  const totalOrders = todayOrders.length;
  const completedOrders = todayOrders.filter(o => o.orderstatus.toLowerCase() === 'billed').length;
  const pendingOrders = todayOrders.filter(o => o.orderstatus.toLowerCase() === 'pending').length;
  const cancelledOrders = todayOrders.filter(o => o.orderstatus.toLowerCase() === 'cancelled').length;

  return (
    <>
      <div className="col-xl-3 col-md-6">
        <div className="card prod-p-card bg-c-blue">
          <div className="card-body">
            <div className="row align-items-center m-b-25">
              <div className="col">
                <h6 className="m-b-5 text-white">Total Orders</h6>
                <h3 className="m-b-0 text-white">{totalOrders}</h3>
              </div>
              <div className="col-auto">
                <i className="fas fa-wallet text-c-blue f-18" />
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
                <h6 className="m-b-5 text-white">Completed Orders</h6>
                <h3 className="m-b-0 text-white">{completedOrders}</h3>
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
                <h6 className="m-b-5 text-white">Pending Orders</h6>
                <h3 className="m-b-0 text-white">{pendingOrders}</h3>
              </div>
              <div className="col-auto">
                <i className="fa fa-spinner text-c-yellow f-18" />
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
                <h6 className="m-b-5 text-white">Cancelled Orders</h6>
                <h3 className="m-b-0 text-white">{cancelledOrders}</h3>
              </div>
              <div className="col-auto">
                <i className="fa fa-times text-c-yellow f-18" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Orders;
