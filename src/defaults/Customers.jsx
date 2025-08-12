import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    surname: '',
    telephone: '',
    base: '',
    addresss: '',
    gender: '',
    dob: '',
    label: ''
  });

  useEffect(() => {
    fetchCustomers();
    fetchLabels();
  }, []);

  const fetchCustomers = () => {
    axiosInstance.get('/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.log(err));
  };

  const fetchLabels = () => {
    axiosInstance.get('/labels')
      .then(res => setLabels(res.data))
      .catch(err => console.log(err));
  };

  const handleAddCustomer = () => {
    axiosInstance.post('/Customers', newCustomer)
      .then(() => {
        fetchCustomers();
        toast.success('Customer added successfully!');
        setShowModal(false);
        setNewCustomer({
          firstName: '',
          surname: '',
          telephone: '',
          base: '',
          addresss: '',
          gender: '',
          dob: '',
          label: ''
        });
      })
      .catch(err => console.log(err));
  };

  const handleDeleteCustomer = (id) => {
    axiosInstance.delete(`/Customers/${id}`)
      .then(() => {
        setCustomers(customers.filter(c => c.id !== id));
        toast.success('Customer deleted!');
      })
      .catch(err => console.log(err));
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter(c =>
    [c.firstName, c.surname, c.telephone].some(field =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const pagedCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

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
                    {/* Simple Search Input */}
                    <div className="col-md-4">
  <input
    type="text"
    className="form-control form-control-sm mb-3"
    placeholder="Search by First Name, Surname or Telephone"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // reset to first page on search
    }}
  />
</div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Surname</th>
                            <th>Telephone</th>
                            <th>Base</th>
                            <th>Label</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedCustomers.map((cust, index) => (
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
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteCustomer(cust.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {pagedCustomers.length === 0 && (
                            <tr>
                              <td colSpan="7" className="text-center">No customers found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <nav className="mt-3">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          >
                            Previous
                          </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Surname</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCustomer.surname}
                      onChange={(e) => setNewCustomer({ ...newCustomer, surname: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Telephone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCustomer.telephone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, telephone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Base</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCustomer.base}
                      onChange={(e) => setNewCustomer({ ...newCustomer, base: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCustomer.addresss}
                      onChange={(e) => setNewCustomer({ ...newCustomer, addresss: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Gender</label>
                    <select
                      className="form-control"
                      value={newCustomer.gender}
                      onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newCustomer.dob}
                      onChange={(e) => setNewCustomer({ ...newCustomer, dob: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Label</label>
                    <select
                      className="form-control"
                      value={newCustomer.label}
                      onChange={(e) => setNewCustomer({ ...newCustomer, label: e.target.value })}
                    >
                      <option value="">Select Label</option>
                      {labels.map(label => (
                        <option key={label.id} value={label.name}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
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
