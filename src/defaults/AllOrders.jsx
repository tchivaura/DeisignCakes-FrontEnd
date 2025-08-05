import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import moment from 'moment';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [productFilter, setProductFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lovedOnes, setLovedOnes] = useState([]);
  const ordersPerPage = 20;

  useEffect(() => {
    axiosInstance.get('/orders').then(res => setOrders(res.data));
    axiosInstance.get('/customers').then(res => setCustomers(res.data));
    axiosInstance.get('/Products').then(res => setProducts(res.data));
    axiosInstance.get('/ProductSizes').then(res => setSizes(res.data));
    axiosInstance.get('/lovedOnes/').then(res => setLovedOnes(res.data));
  }, []);

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.surname}` : 'Unknown';
  };

  const getProductName = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.productName : 'Unknown';
  };

  const getProductSize = (id) => {
    const productsize = sizes.find(p => p.id === id);
    return productsize ? productsize.size : 'Unknown';
  };

  const start = startDate ? moment(startDate).startOf('day') : null;
  const end = endDate ? moment(endDate).endOf('day') : null;

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order.customerid).toLowerCase();
    const orderDate = moment(order.orderdate);


    return (
      (!statusFilter || order.orderstatus.toLowerCase() === statusFilter.toLowerCase()) &&
      (!productFilter || order.orderproduct == productFilter) &&
      (!start || orderDate.isSameOrAfter(start)) &&
      (!end || orderDate.isSameOrBefore(end)) &&
      (!searchName || customerName.includes(searchName.toLowerCase()))
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const totalAmount = filteredOrders.reduce((sum, order) => {
  return sum + (parseFloat(order.price) * parseInt(order.quantity));
}, 0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setProductFilter('');
    setStartDate('');
    setEndDate('');
    setSearchName('');
    setCurrentPage(1);
  };

  return (
    <div className="pcoded-main-container">
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
                <div className="mb-3">
                  <h5>Orders</h5>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-2">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter name..."
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Status Filter</label>
                        <select
                          className="form-control"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="partially paid">Partially Paid</option>
                          <option value="billed">Billed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label>Product Filter</label>
                        <select
                          className="form-control"
                          value={productFilter}
                          onChange={(e) => setProductFilter(e.target.value)}
                        >
                          <option value="">All</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.productName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label>Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label>End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-secondary w-100" onClick={resetFilters}>
                          Reset Filters
                        </button>
                      </div>
                    </div>

                    {/* Scrollable table wrapper */}
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Order Date</th>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Order For</th>
                            <th>Customer</th>
                            <th>Extra Instructions</th>
                            <th>Occasion</th>
                            <th>Status</th>
                            <th>Operator</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                              <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{moment(order.orderdate).format('YYYY-MM-DD HH:mm')}</td>
                                <td>{getProductName(order.orderproduct)}</td>
                                <td>{getProductSize(order.size)}</td>
                                <td>{order.price}</td>
                                <td>{order.quantity}</td>
                                <td>
                                  {Number(order.orderperson) === 1
                                    ? 'Self'
                                    : lovedOnes.find((l) => Number(l.id) === Number(order.orderperson))?.fullName || 'Other'}
                                </td>
                                <td>{getCustomerName(order.customerid)}</td>
                                <td>{order.extrainstructions}</td>
                                 <td>{order.occasion}</td>
                                <td>{order.orderstatus}</td>
                                <td>{order.clerk}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="11" className="text-center">No orders found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    
                    
                    <div className="mb-2">
  <strong style={{ fontWeight: 'bold' }}> Total Amount:  ${totalAmount.toFixed(2)}</strong> 
</div></div>
                    

                    {totalPages > 1 && (
                      <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                          {[...Array(totalPages)].map((_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                              onClick={() => handlePageChange(index + 1)}
                            >
                              <button className="page-link">
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllOrders;
