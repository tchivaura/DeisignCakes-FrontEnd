import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchableList from '../components/SearchableList';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 20;
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

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const pagedCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(customers.length / customersPerPage);

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
                    <SearchableList
                      data={pagedCustomers}
                      headers={['#', 'First Name', 'Surname', 'Telephone', 'Base', 'Label', 'Action']}
                      searchFields={['firstName', 'surname', 'telephone']}
                      renderRow={(cust, index) => (
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
                      )}
                    />
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {[
                    { label: 'First Name', value: 'firstName' },
                    { label: 'Surname', value: 'surname' },
                    { label: 'Telephone', value: 'telephone' },
                    { label: 'Base', value: 'base' },
                    { label: 'Address', value: 'addresss' },
                  ].map(({ label, value }) => (
                    <div className="col-md-4 mb-3" key={value}>
                      <label>{label}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newCustomer[value]}
                        onChange={(e) => setNewCustomer({ ...newCustomer, [value]: e.target.value })}
                      />
                    </div>
                  ))}

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
