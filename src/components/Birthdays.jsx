import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Birthdays() {
  const [lovedones, setLovedones] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, lovedonesRes] = await Promise.all([
          axiosInstance.get('/customers'),
          axiosInstance.get('/lovedOnes/upcomingbirthdays'),
        ]);

        setCustomers(customersRes.data);
        setLovedones(lovedonesRes.data);

        // Only show toast if there are upcoming birthdays
        if (lovedonesRes.data.length > 0) {
          toast.info(`🎉 You have ${lovedonesRes.data.length} upcoming birthdays!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (err) {
        console.error('Error fetching birthday data:', err);
      }
    };

    fetchData();
  }, []);

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.surname}` : 'Unknown';
  };

  const getCustomerPhoneNumber = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.telephone : 'Unknown';
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = lovedones.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(lovedones.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <ToastContainer />
      <div className="col-xl-12 col-md-12">
        <div className="card table-card">
          <div className="card-header">
            <h5 className="top-heading">{lovedones.length} Upcoming Birthdays</h5>
          </div>
          <div className="card-body px-0 py-0">
            <div className="table-responsive">
              <div className="session-scroll" style={{ height: 478, position: "relative" }}>
                <table className="table table-hover m-b-0">
                  <thead>
                    <tr>
                      <th>FullName</th>
                      <th>Turning</th>
                      <th>BirthDay Date</th>
                      <th>Gender</th>
                      <th>Relation To Customer</th>
                      <th>Customer Name</th>
                      <th>Customer Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((lovedone, index) => (
                        <tr key={index}>
                          <td>{lovedone.lovedOneName}</td>
                          <td>{lovedone.ageTurning}</td>
                          <td>
                            {new Date(lovedone.nextBirthday).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                          <td>{lovedone.gender}</td>
                          <td>{lovedone.relationship}</td>
                          <td>{getCustomerName(lovedone.customerId)}</td>
                          <td>{getCustomerPhoneNumber(lovedone.customerId)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No upcoming birthdays
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {lovedones.length > 0 && (
              <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
                <nav>
                  <ul className="pagination">
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Birthdays;
