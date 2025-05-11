import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasicCustomerDetails from '../components/BasicCustomerDetails';

function OrderCreation() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers on mount
  useEffect(() => {
    axiosInstance.get('/customers')
      .then((res) => setCustomers(res.data))
      .catch(() => toast.error("Failed to fetch customers"));
  }, []);

  // Filter customers on search term
  useEffect(() => {
    const search = searchTerm.toLowerCase();
    if (search.length > 0) {
      const filtered = customers.filter(customer =>
        `${customer.firstName} ${customer.surname}`.toLowerCase().includes(search)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm, customers]);

  // When user selects a customer from dropdown
  const handleSelect = (customer) => {
    setSearchTerm(`${customer.firstName} ${customer.surname}`);
    setSelectedCustomer(customer);
    setFilteredCustomers([]);
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
                {selectedCustomer && (
                  <BasicCustomerDetails customer={selectedCustomer} />
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
