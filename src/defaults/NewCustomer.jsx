import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewCustomer({ prefillName, onCustomerAdded }) {
  const [customer, setCustomer] = useState({
    firstName: '',
    surname: '',
    addresss: '',
    telephone: '',
    gender: '',
    dob: '',
    base: '',
    label: ''
  });
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/Labels`).then(res => {
      setLabels(res.data);
    });
  }, []);

  useEffect(() => {
    if (prefillName) {
      const parts = prefillName.trim().split(' ');
      const firstName = parts[0] || '';
      const surname = parts.slice(1).join(' ') || '';
      setCustomer(prev => ({
        ...prev,
        firstName,
        surname
      }));
    }
  }, [prefillName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    axiosInstance.post('/Customers', customer)
      .then((res) => {
        toast.success('Customer added successfully!');
        if (onCustomerAdded) onCustomerAdded(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="card">
      <div className="card-header"><h5>New Customer</h5></div>
      <div className="card-body">
        <form>
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={customer.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="addresss"
                value={customer.addresss}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Telephone</label>
              <input
                type="text"
                className="form-control"
                name="telephone"
                value={customer.telephone}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-control"
                id="gender"
                name="gender"
                value={customer.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Surname</label>
              <input
                type="text"
                className="form-control"
                name="surname"
                value={customer.surname}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={customer.dob}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Base</label>
              <input
                type="text"
                className="form-control"
                name="base"
                value={customer.base}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="label" className="form-label">Label</label>
              <select
                className="form-control"
                id="label"
                name="label"
                value={customer.label}
                onChange={handleChange}
              >
                <option value="">Select Label</option>
                {labels.map(label => (
                  <option key={label.id} value={label.name}>{label.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12" style={{ alignItems: "center", marginLeft: "500px" }}>
              <button type="submit" className="btn btn-primary" onClick={handleAddCustomer}>Add Customer</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCustomer;
