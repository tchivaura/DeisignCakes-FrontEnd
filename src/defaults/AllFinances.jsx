import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axios';

function AllFinances() {
  const [allpayments, setAllpayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [suppliers, setsuppliers] = useState([]);
  const [filters, setFilters] = useState({
    paymentType: '',
    transactionType: '',
    startDate: '',
    endDate: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAllPayments();
    axiosInstance.get('/paymenttypes').then(res => setPaymentTypes(res.data));
    axiosInstance.get('/suppliers').then(res => setsuppliers(res.data));
  }, []);

  const fetchAllPayments = () => {
    axiosInstance
      .get('/Payments')
      .then((res) => {
        setAllpayments(res.data);
        setFilteredPayments(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    setFilters({
      paymentType: '',
      transactionType: '',
      startDate: '',
      endDate: ''
    });
  };

  useEffect(() => {
    filterPayments();
    setCurrentPage(1);
  }, [filters, allpayments]);

  const filterPayments = () => {
    let data = [...allpayments];

    if (filters.paymentType) {
      data = data.filter(p => p.paymenttype == filters.paymentType);
    }

    if (filters.transactionType) {
      data = data.filter(p => (p.description === 'order' ? 'Order' : 'Expense') === filters.transactionType);
    }

    if (filters.startDate) {
      data = data.filter(p => new Date(p.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      data = data.filter(p => new Date(p.date) <= new Date(filters.endDate));
    }

    setFilteredPayments(data);
  };

  const totalAmount = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Pagination Logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>Transactions</h5>
                  </div>

                  <div className="card-body">
                    {/* Filters + Reset on same row */}
                    <div className="row mb-3">
                      <div className="col-md-2">
                        <label>Payment Method</label>
                        <select className="form-control" name="paymentType" value={filters.paymentType} onChange={handleFilterChange}>
                          <option value="">All</option>
                          {paymentTypes.map(pt => (
                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-2">
                        <label>Transaction Type</label>
                        <select className="form-control" name="transactionType" value={filters.transactionType} onChange={handleFilterChange}>
                          <option value="">All</option>
                          <option value="Order">Order</option>
                          <option value="Expense">Expense</option>
                        </select>
                      </div>

                      <div className="col-md-2">
                        <label>Start Date</label>
                        <input type="date" className="form-control" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                      </div>

                      <div className="col-md-2">
                        <label>End Date</label>
                        <input type="date" className="form-control" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                      </div>

                      <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-secondary w-100" onClick={handleResetFilters}>
                          Reset Filters
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Payment Method</th>
                          <th>Transaction Type</th>
                          <th>Payment Detail</th>
                          <th>Supplier</th>
                          <th>Amount</th>
                          <th>Operator</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((ex) => (
                          <tr key={ex.id}>
                            <td>{ex.date}</td>
                            <td>{paymentTypes.find((pt) => pt.id == ex.paymenttype)?.name || 'Unknown'}</td>
                            <td>{(ex.description) === 'order' ? 'Order' : 'Expense'}</td>
                            <td>{(ex.expensedetail == null) ? 'Order Payment' : ex.expensedetail}</td>
                           <td>{suppliers.find((pt) => pt.id == ex.supplier)?.suppliername || ''}</td>
                            <td>{ex.amount}</td>
                            <td>{ex.clerk}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4"><strong style={{ fontWeight: 'bold' }}>Total</strong></td>
                          <td colSpan="2"><strong style={{ fontWeight: 'bold' }}>{totalAmount.toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Page {currentPage} of {totalPages}</span>
                      <div>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          Previous
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div> {/* end card-body */}
                </div> {/* end card */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllFinances;
