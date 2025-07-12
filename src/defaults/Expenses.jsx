import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axios';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [expense, setNewExpense] = useState({
    paymenttype: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    description: 'expense',
    expensedetail: '',
    clerk: window.localStorage.getItem("username")
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterPaymentType, setFilterPaymentType] = useState('');

  useEffect(() => {
    fetchAllExpenses();
    axiosInstance.get('/paymenttypes').then(res => setPaymentTypes(res.data));
  }, []);

  const fetchAllExpenses = () => {
    axiosInstance
      .get('/Payments/bydescription/expense')
      .then((res) => setExpenses(res.data))
      .catch((err) => console.log(err));
  };

  const resetForm = () => {
    setNewExpense({
      paymenttype: '',
      description: 'expense',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      expensedetail: '',
      clerk: window.localStorage.getItem("username")
    });
    setEditExpense(null);
    setShowModal(false);
  };

  const handleEditExpense = (ex) => {
    setEditExpense(ex.id);
    setNewExpense({
      paymenttype: ex.paymenttype,
      description: 'expense',
      amount: Math.abs(ex.amount),
      date: new Date().toISOString().slice(0, 10),
      expensedetail: ex.expensedetail,
      clerk: ex.clerk
    });
    setShowModal(true);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      axiosInstance.delete(`/Payments/${id}`).then(() => {
        fetchAllExpenses();
        toast.success('Expense deleted!');
      });
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveExpense = () => {
    let { amount, expensedetail, paymenttype } = expense;
    if (!amount || !expensedetail || !paymenttype) {
      toast.error('All fields are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Amount must be a valid number greater than zero");
      return;
    }
    const payload = {
      ...expense,
      amount: (-Math.abs(parsedAmount)).toString()
    };

    const request = editExpense
      ? axiosInstance.put(`/payments/${editExpense}`, payload)
      : axiosInstance.post(`/payments`, payload);

    request.then(() => {
      toast.success(editExpense ? "Expense updated" : "Expense added");
      resetForm();
      fetchAllExpenses();
    });
  };

  // Filtering
  const filteredExpenses = expenses.filter((ex) => {
    const matchesPaymentType = filterPaymentType ? ex.paymenttype == filterPaymentType : true;
    const matchesFromDate = fromDate ? new Date(ex.date) >= new Date(fromDate) : true;
    const matchesToDate = toDate ? new Date(ex.date) <= new Date(toDate) : true;
    return matchesPaymentType && matchesFromDate && matchesToDate;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const displayedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAmount = filteredExpenses.reduce((sum, ex) => sum + Math.abs(ex.amount), 0);

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
                    <h5>Expenses</h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditExpense(null);
                        resetForm();
                        setShowModal(true);
                      }}
                    >
                      Add Expense
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label>From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label>Payment Type</label>
                        <select
                          className="form-control"
                          value={filterPaymentType}
                          onChange={(e) => setFilterPaymentType(e.target.value)}
                        >
                          <option value="">All</option>
                          {paymentTypes.map(pt => (
                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Table */}
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Payment Type</th>
                          <th>Payment Detail</th>
                          <th>Amount</th>
                          <th>Operator</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedExpenses.map((ex) => (
                          <tr key={ex.id}>
                            <td>{ex.date}</td>
                            <td>{paymentTypes.find((pt) => pt.id == ex.paymenttype)?.name || 'Unknown'}</td>
                            <td>{ex.expensedetail}</td>
                            <td>{Math.abs(ex.amount)}</td>
                            <td>{(ex.clerk)}</td>
                            <td>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditExpense(ex)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExpense(ex.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td >
                            
                            <strong style={{ fontWeight: 'bold' }} ><span>Total</span>&nbsp;&nbsp;&nbsp;<span>  {totalAmount} </span></strong></td>
                          
                          
                        </tr>
                      </tfoot>
                    </table>

                    {/* Pagination */}
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Modal */}
                {showModal && (
                  <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{editExpense ? 'Edit Expense' : 'Add Expense'}</h5>
                          <button type="button" className="btn-close" onClick={resetForm}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group mb-2">
                            <label>Payment Type</label>
                            <select
                              name="paymenttype"
                              className="form-control"
                              value={expense.paymenttype}
                              onChange={handleExpenseChange}
                            >
                              <option value="">Select Payment Type</option>
                              {paymentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group mb-2">
                            <label>Expense Detail</label>
                            <input
                              type="text"
                              name="expensedetail"
                              className="form-control"
                              onChange={handleExpenseChange}
                              value={expense.expensedetail}
                            />
                          </div>

                          <div className="form-group mb-2">
                            <label>Amount</label>
                            <input
                              type="number"
                              name="amount"
                              className="form-control"
                              onChange={handleExpenseChange}
                              value={expense.amount}
                            />
                          </div>

                          <div className="form-group mb-2">
                            <label>Date</label>
                            <input
                              type="date"
                              name="date"
                              className="form-control"
                              onChange={handleExpenseChange}
                              value={expense.date}
                            />
                          </div>
                        </div>

                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                          <button className="btn btn-primary" onClick={handleSaveExpense}>Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
