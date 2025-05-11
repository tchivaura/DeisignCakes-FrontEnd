import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasicOrderDetails from '../components/BasicOrderDetails';

function PaymentCreation() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch all orders and filter them by 'pending' and 'partially billed'
    axiosInstance.get("/orders")
      .then((res) => {
        const filteredByStatus = res.data.filter(order =>
          order.orderstatus === 'Pending' || order.orderstatus === 'Partially Billed'
        );
        setOrders(filteredByStatus);
      })
      .catch(() => toast.error("Failed to fetch orders"));

    axiosInstance.get("/customers")
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Failed to fetch customers"));

    axiosInstance.get("/ProductSizes")
      .then((res) => setProductSizes(res.data))
      .catch(() => toast.error("Failed to fetch product sizes"));

    axiosInstance.get("/Products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to fetch products"));
  }, []);

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    if (search.length > 0) {
      const filtered = orders.filter(order => {
        const customer = customers.find(c => c.id === order.customerId || c.id === Number(order.customerId));
        const product = products.find(p => p.id === order.orderproduct || p.id === Number(order.orderproduct));

        const customerName = customer ? `${customer.firstName} ${customer.surname}`.toLowerCase() : '';
        const productName = product ? product.ProductName.toLowerCase() : '';

        return customerName.includes(search) || productName.includes(search);
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [searchTerm, orders, customers, products]);

  const handleSelect = (order) => {
    const customer = customers.find(c => c.id === order.customerId || c.id === Number(order.customerId));
    const product = products.find(p => p.id === order.orderproduct || p.id === Number(order.orderproduct));
    setSelectedOrder({ ...order, customer, product });
    setSearchTerm(customer ? `${customer.firstName} ${customer.surname}` : '');
    setFilteredOrders([]);
  };

  const getSizeName = (sizeId) => {
    const size = productSizes.find(s => s.id === sizeId || s.id === Number(sizeId));
    return size ? size.size : "Unknown Size";
  };

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">

                {/* Page Header */}
                <div className="page-header">
                  <div className="page-block">
                    <div className="row align-items-center">
                      <div className="col-md-12">
                        <div className="page-header-title">
                          <h5 className="m-b-10">Payment Creation</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Box */}
                <div className="row">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="order-search-input" className="form-label">Search Order</label>
                    <input
                      id="order-search-input"
                      type="text"
                      className="form-control mb-3"
                      placeholder="Search customer or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => setTimeout(() => setFilteredOrders([]), 150)}
                    />
                    {filteredOrders.length > 0 && (
                      <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                        {filteredOrders.map(order => {
                          const customer = customers.find(c => c.id === order.customerId || c.id === Number(order.customerId));
                          const product = products.find(p => p.id === order.orderproduct || p.id === Number(order.orderproduct));
                          const sizeName = getSizeName(order.size);

                          return (
                            <li
                              key={order.id}
                              className="list-group-item list-group-item-action"
                              onMouseDown={() => handleSelect(order)}
                              style={{ cursor: 'pointer' }}
                            >
                              {customer ? `${customer.firstName} ${customer.surname}` : "Unknown Customer"} |
                              Order ID: {order.id} |
                              Product: {product ? product.ProductName : "Unknown Product"} |
                              Size: {sizeName}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Selected Order Details */}
                {selectedOrder && (
                  <BasicOrderDetails
                    Order={selectedOrder}
                    ProductSize={getSizeName(selectedOrder.size)}
                  />
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCreation;
