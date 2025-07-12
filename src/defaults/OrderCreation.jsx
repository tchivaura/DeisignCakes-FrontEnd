import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasicCustomerDetails from '../components/BasicCustomerDetails';
import NewCustomer from './NewCustomer';

function OrderCreation() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  useEffect(() => {
    axiosInstance.get('/customers')
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Failed to fetch customers"));
  }, []);

  useEffect(() => {
    const search = searchTerm.trim().toLowerCase();
    if (search.length > 0) {
      const filtered = customers.filter(customer =>
        `${customer.firstName} ${customer.surname}`.toLowerCase().includes(search)
      );
      setFilteredCustomers(filtered);
      if (filtered.length === 0) {
        setSelectedCustomer(null);
        setShowNewCustomerForm(true);
      } else {
        setShowNewCustomerForm(false);
      }
    } else {
      setFilteredCustomers([]);
      setShowNewCustomerForm(false);
      setSelectedCustomer(null);
    }
  }, [searchTerm, customers]);

  const handleSelect = (customer) => {
    setSearchTerm(`${customer.firstName} ${customer.surname}`);
    setSelectedCustomer(customer);
    setShowNewCustomerForm(false);
    setFilteredCustomers([]);
  };

  const handleCustomerAdded = (newCustomer) => {
    setSelectedCustomer(newCustomer);
    setShowNewCustomerForm(false);
    setSearchTerm(`${newCustomer.firstName} ${newCustomer.surname}`);
    setCustomers(prev => [...prev, newCustomer]);
  };

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
                <div className="page-header">
                  <div className="page-block">
                    <div className="row align-items-center">
                      <div className="col-md-12">
                        <div className="page-header-title">
                          <h5 className="m-b-10">Order Creation</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔍 Search Box */}
                <div className="row">
                  <div className="col-md-3 position-relative">
                    <label htmlFor="customer-search-input" className="form-label">
                      Search Customer
                    </label>
                    <input
                      id="customer-search-input"
                      type="text"
                      className="form-control mb-1"
                      placeholder="Search customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => setTimeout(() => setFilteredCustomers([]), 150)}
                    />
                    {filteredCustomers.length > 0 && (
                      <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                        {filteredCustomers.map(customer => (
                          <li
                            key={customer.id}
                            className="list-group-item list-group-item-action"
                            onMouseDown={() => handleSelect(customer)}
                            style={{ cursor: 'pointer' }}
                          >
                            {customer.firstName} {customer.surname}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* 👤 Customer Details Form */}
                {selectedCustomer && !showNewCustomerForm && (
                  <BasicCustomerDetails customer={selectedCustomer} />
                )}

                {/* 🆕 New Customer Form */}
                {!selectedCustomer && showNewCustomerForm && (
                  <NewCustomer prefillName={searchTerm} onCustomerAdded={handleCustomerAdded} />
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCreation;