import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [labels, setLabels] = useState([]);  // New state for labels
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    surname: '',
    telephone: '',
    base: '',
    address: '',  // Added address field
    gender: '',   // Added gender field
    dob: '',      // Added date of birth field
    label: ''     // Will store selected label's ID
  });

  useEffect(() => {
    fetchCustomers();
    fetchLabels(); // Fetch the labels when the component loads
  }, []);

  const fetchCustomers = () => {
    axiosInstance.get('/customers')
      .then(res => {
        setCustomers(res.data);
      })
      .catch(err => console.log(err));
  };

  const fetchLabels = () => {
    axiosInstance.get('/labels')  // Fetch labels from the backend
      .then(res => {
        setLabels(res.data);
      })
      .catch(err => console.log(err));
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handleDeleteCustomer = (id) => {
    axiosInstance.delete(`/customers/${id}`)
      .then(() => {
        setCustomers(customers.filter(cust => cust.id !== id));
        toast.success('Customer deleted!');
      })
      .catch(err => console.log(err));
  };

  const handleAddCustomer = () => {
    axiosInstance.post('/customers', newCustomer)
      .then(() => {
        fetchCustomers();
        toast.success('Customer added successfully!');
        setShowModal(false);
        setNewCustomer({
          firstName: '',
          surname: '',
          telephone: '',
          base: '',
          address: '',   // Reset address
          gender: '',    // Reset gender
          dob: '',       // Reset date of birth
          label: ''      // Reset label
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">

               

                <div className="card">
                  <div className="card-header d-flex justify-content-between">
                    <h5>Customers</h5>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                      Add Customer
                    </button>
                  </div>
                  <div className="card-body table-border-style">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First Name</th>
                          <th>Surname</th>
                          <th>Telephone</th>
                          <th>Base</th>
                          <th>Label</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentCustomers.map((cust, index) => (
                          <tr key={cust.id}>
                            <td>{indexOfFirstCustomer + index + 1}</td>
                            <td>{cust.firstName}</td>
                            <td>{cust.surname}</td>
                            <td>{cust.telephone}</td>
                            <td>{cust.base}</td>
                            <td>{cust.label}</td>
                            <td>
                              <Link to={`/editcustomer/${cust.id}`} className="btn btn-sm btn-warning me-2">
                                Edit
                              </Link>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCustomer(cust.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="page-link">{i + 1}</span>
                      </li>
                    ))}
                  </ul>
                </nav>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-2">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Surname</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.surname}
                    onChange={(e) => setNewCustomer({ ...newCustomer, surname: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Telephone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.telephone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, telephone: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Base</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.base}
                    onChange={(e) => setNewCustomer({ ...newCustomer, base: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Gender</label>
                  <select
                    className="form-control"
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newCustomer.dob}
                    onChange={(e) => setNewCustomer({ ...newCustomer, dob: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <label>Label</label>
                  <select
                    className="form-control"
                    value={newCustomer.label}
                    onChange={(e) => setNewCustomer({ ...newCustomer, label: e.target.value })}
                  >
                    <option value="">Select Label</option>
                    {labels.map((label) => (
                      <option key={label.id} value={label.labelname}>
                        {label.labelname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleAddCustomer}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
