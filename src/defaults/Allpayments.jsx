import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [fromDate, setFromDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [toDate, setToDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, searchCustomer, selectedPaymentType, fromDate, toDate]);

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 when filters change
  }, [filteredPayments]);

  const fetchAllData = async () => {
    const [paymentsRes, paymentTypesRes, ordersRes, customersRes] = await Promise.all([
      axiosInstance.get('Payments/bydescription/order'),
      axiosInstance.get('/paymenttypes'),
      axiosInstance.get('/orders'),
      axiosInstance.get('/customers'),
    ]);
    setPayments(paymentsRes.data);
    setPaymentTypes(paymentTypesRes.data);
    setOrders(ordersRes.data);
    setCustomers(customersRes.data);
  };

  const getPaymentTypeName = (typeId) => {
    const type = paymentTypes.find((t) => t.id == typeId);
    return type ? type.name : 'Unknown';
  };

  const getCustomerByOrderId = (orderId) => {
    const order = orders.find((o) => o.id == orderId);
    if (!order) return null;
    return customers.find((c) => c.id === order.customerid);
  };

  const applyFilters = () => {
    let result = [...payments];

    if (searchCustomer.trim()) {
      result = result.filter((payment) => {
        const customer = getCustomerByOrderId(payment.orderid);
        const fullName = customer ? `${customer.firstName} ${customer.surname}`.toLowerCase() : '';
        return fullName.includes(searchCustomer.toLowerCase());
      });
    }

    if (selectedPaymentType) {
      result = result.filter((payment) => payment.paymenttype === selectedPaymentType);
    }

    if (fromDate) {
      result = result.filter((payment) => new Date(payment.date) >= new Date(fromDate));
    }

    if (toDate) {
      result = result.filter((payment) => new Date(payment.date) <= new Date(toDate));
    }

    setFilteredPayments(result);
  };

  const resetFilters = () => {
    setSearchCustomer('');
    setSelectedPaymentType('');
    setFromDate('');
    setToDate('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="pcoded-main-container">
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper"></div>

              <div className="mb-3">
                <h5>Customer Payments</h5>
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
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <label htmlFor="paymentType" className="form-label">Payment Type</label>
                      <select
                        id="paymentType"
                        className="form-control"
                        value={selectedPaymentType}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                      >
                        <option value="">All Payment Types</option>
                        {paymentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
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
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-2">
                      <label htmlFor="toDate" className="form-label">To Date</label>
                      <input
                        id="toDate"
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-2 d-flex align-items-end">
                      <button className="btn btn-secondary w-100" onClick={resetFilters}>
                        Reset
                      </button>
                    </div>
                  </div>

                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Payment Type</th>
                        <th>Amount</th>
                        <th>Operator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((payment) => {
                        const customer = getCustomerByOrderId(payment.orderid);
                        return (
                          <tr key={payment.id}>
                            <td>{payment.orderid}</td>
                            <td>{payment.date}</td>
                            <td>{customer ? `${customer.firstName} ${customer.surname}` : 'Unknown'}</td>
                            <td>{getPaymentTypeName(payment.paymenttype)}</td>
                            <td style={{ textAlign: "right" }}>${payment.amount}</td>
                            <td>{payment.clerk}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h5>
                      Total Amount: ${filteredPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0).toFixed(2)}
                    </h5>
                   <div className="d-flex align-items-center gap-2">
  <button
    className="btn btn-sm btn-outline-primary"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span className="mx-2">Page {currentPage} of {totalPages}</span>

  <button
    className="btn btn-sm btn-outline-primary"
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
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
      </div>
    </div>
  );
};

export default AllPayments;
