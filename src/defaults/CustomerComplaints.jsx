import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

function CustomerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [productFilter, setProductFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [lovedOnes, setLovedOnes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchComplaints();
    axiosInstance.get('/orders').then(res => setOrders(res.data));
    axiosInstance.get('/customers').then(res => setCustomers(res.data));
    axiosInstance.get('/Products').then(res => setProducts(res.data));
    axiosInstance.get('/ProductSizes').then(res => setSizes(res.data));
    axiosInstance.get('/lovedOnes').then(res => setLovedOnes(res.data));
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axiosInstance.get('/Complaints');
      setComplaints(res.data);
      setFilteredComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.surname}` : 'Unknown';
  };

  const getProductName = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.productName : 'Unknown';
  };

  const getProductOrderID = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? order.orderproduct : null;
  };

  const applyFilters = () => {
    let filtered = complaints;

    if (searchName.trim()) {
      filtered = filtered.filter(c => {
        const customerName = getCustomerName(c.customerId).toLowerCase();
        return customerName.includes(searchName.toLowerCase());
      });
    }

    if (productFilter) {
      filtered = filtered.filter(c => {
        const productId = getProductOrderID(c.orderId);
        return productId === parseInt(productFilter);
      });
    }

    if (startDate) {
      const start = moment(startDate, 'YYYY-MM-DD').startOf('day');
      filtered = filtered.filter(c =>
        moment(c.date, 'DD/MM/YYYY').isSameOrAfter(start)
      );
    }

    if (endDate) {
      const end = moment(endDate, 'YYYY-MM-DD').endOf('day');
      filtered = filtered.filter(c =>
        moment(c.date, 'DD/MM/YYYY').isSameOrBefore(end)
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1); // Reset to page 1 after filtering
  };

  useEffect(() => {
    applyFilters();
  }, [searchName, productFilter, startDate, endDate, complaints]);

  const resetFilters = () => {
    setSearchName('');
    setProductFilter('');
    setStartDate('');
    setEndDate('');
    setFilteredComplaints(complaints);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="pcoded-main-container">
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper"></div>

              <div className="mb-3">
                <h5>Complaints</h5>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-3 mb-2">
                      <label htmlFor="searchCustomer" className="form-label">Search Customer</label>
                      <input
                        id="searchCustomer"
                        type="text"
                        className="form-control"
                        placeholder="Enter customer name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label htmlFor="productFilter" className="form-label">Filter by Product</label>
                      <select
                        id="productFilter"
                        className="form-control"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                      >
                        <option value="">All Products</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.productName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2 mb-2">
                      <label htmlFor="fromDate" className="form-label">From Date</label>
                      <input
                        id="fromDate"
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-2 mb-2">
                      <label htmlFor="toDate" className="form-label">To Date</label>
                      <input
                        id="toDate"
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-2 mb-2 d-flex align-items-end">
                      <button className="btn btn-secondary w-100" onClick={resetFilters}>
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Complaint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((complaint) => (
                          <tr key={complaint.id}>
                            <td>{complaint.orderId}</td>
                            <td>{moment(complaint.date, 'DD/MM/YYYY').format('YYYY-MM-DD')}</td>
                            <td>{getCustomerName(complaint.customerId)}</td>
                            <td>{getProductName(getProductOrderID(complaint.orderId))}</td>
                            <td>{complaint.complaint}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No complaints found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Buttons */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-primary"
                      onClick={handleNext}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CustomerComplaints;
