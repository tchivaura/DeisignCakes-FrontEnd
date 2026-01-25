import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrdersAnalysis() {
  const [topCustomers, setTopCustomers] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Default start: Jan 1 of current year, default end: today
  const defaultStartDate = new Date(new Date().getFullYear(), 0, 1)
    .toISOString()
    .split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  useEffect(() => {
    fetchTopCustomers();
  }, [filters]);

  const fetchTopCustomers = async () => {
    const { startDate, endDate } = filters;
    try {
      // 1️⃣ Get top customers
      const res = await axiosInstance.get(
        `/Orders/top-customers?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      );
      setTopCustomers(res.data);

      // 2️⃣ Fetch all customer details in parallel
      const customerRequests = res.data.map(cust =>
        axiosInstance.get(`/customers/${cust.customerId}`)
      );

      const customerResponses = await Promise.all(customerRequests);

      // 3️⃣ Build a dictionary of details
      const details = {};
      customerResponses.forEach((r, i) => {
        const custId = res.data[i].customerId;
        details[custId] = {
          firstName: r.data.firstName,
          surname: r.data.surname,
        };
      });

      setCustomerDetails(details);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch top customers');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    });
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = topCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(topCustomers.length / itemsPerPage);

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
                    <h5>Top Customers</h5>
                    <div className="d-flex gap-2">
                      <div>
                        <label>Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div>
                        <label>End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="d-flex align-items-end">
                        <button className="btn btn-secondary" onClick={handleResetFilters}>
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body table-border-style">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Surname</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((cust, index) => {
                            const details = customerDetails[cust.customerId];
                            return (
                              <tr key={cust.customerId}>
                                <td>{indexOfFirst + index + 1}</td>
                                <td>{details?.firstName || 'Loading...'}</td>
                                <td>{details?.surname || 'Not Available'}</td>
                                <td>{parseFloat(cust.totalAmount).toFixed(2)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
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
                          disabled={currentPage === totalPages || totalPages === 0}
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

export default OrdersAnalysis;
