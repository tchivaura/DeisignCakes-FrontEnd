import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axios';

function AllFinances() {
  const [allPayments, setAllPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);

  const [filters, setFilters] = useState({
    paymentType: '',        // '' = All
    transactionType: '',    // '' = All
    startDate: '',          // '' = no filter
    endDate: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load data on first render
  useEffect(() => {
    fetchAllPayments();
    fetchPaymentTypes();
    fetchSuppliers();
  }, []);

  const fetchAllPayments = async () => {
    try {
      const res = await axiosInstance.get('/Payments');
      setAllPayments(res.data);
      setFilteredPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const res = await axiosInstance.get('/paymenttypes');
      setPaymentTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axiosInstance.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      paymentType: '',
      transactionType: '',
      startDate: '',
      endDate: ''
    });
  };

  // Watch filters and payments
  useEffect(() => {
    filterPayments();
    fetchOpeningBalance();
    setCurrentPage(1);
  }, [filters, allPayments]);

  const filterPayments = () => {
    let data = [...allPayments];

    // Payment type
    if (filters.paymentType) {
      data = data.filter(p => p.paymenttype == filters.paymentType);
    }

    // Transaction type
    if (filters.transactionType) {
      data = data.filter(p => (p.description === 'order' ? 'Order' : 'Expense') === filters.transactionType);
    }

    // Start date
    if (filters.startDate) {
      data = data.filter(p => new Date(p.date) >= new Date(filters.startDate));
    }

    // End date
    if (filters.endDate) {
      data = data.filter(p => new Date(p.date) <= new Date(filters.endDate));
    }

    setFilteredPayments(data);
  };

  const fetchOpeningBalance = () => {
    // If startDate is empty, get full balance
    const startParam = filters.startDate || '';
    const paymentTypeParam = filters.paymentType || '';

    axiosInstance
      .get(`/payments/balance?startdate=${startParam}&paymenttype=${paymentTypeParam}`)
      .then(res => setOpeningBalance(res.data))
      .catch(err => {
        console.error('Failed to fetch opening balance:', err);
        setOpeningBalance(0);
      });
  };

  const filteredTotal = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const closingBalance = openingBalance + filteredTotal;

  // Pagination
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
                    {/* Filters */}
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
                        {/* Opening Balance */}
                        <tr style={{ backgroundColor: '#e7f3ff', fontWeight: 'bold' }}>
                          <td colSpan="5">Opening Balance</td>
                          <td>{openingBalance.toFixed(2)}</td>
                          <td></td>
                        </tr>

                        {/* Transactions */}
                        {currentItems.map((ex) => (
                          <tr key={ex.id}>
                            <td>{ex.date}</td>
                            <td>{paymentTypes.find((pt) => pt.id == ex.paymenttype)?.name || 'Unknown'}</td>
                            <td>{(ex.description === 'order') ? 'Order' : 'Expense'}</td>
                            <td>{ex.expensedetail || 'Order Payment'}</td>
                            <td>{suppliers.find((s) => s.id == ex.supplier)?.suppliername || ''}</td>
                            <td>{ex.amount}</td>
                            <td>{ex.clerk}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="4"><strong>Closing Balance</strong></td>
                          <td colSpan="2"><strong>{closingBalance.toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Page {currentPage} of {totalPages}</span>
                      <div>
                        <button className="btn btn-sm btn-primary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                        <button className="btn btn-sm btn-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
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
