import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../api/axios';
import 'react-toastify/dist/ReactToastify.css';

function Suppliers() {
  const [suppliers, setsuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editSupplierId, seteditSupplierId] = useState(null);
  const [newSupplier, setnewSupplier] = useState({ suppliername: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllsuppliers();
  }, []);

  const fetchAllsuppliers = () => {
    axiosInstance.get('/suppliers')
      .then(res =>
      
         
         setsuppliers(res.data)
  )
      .catch(err => console.log(err));
  };

  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setnewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSupplier = () => {
    const name = newSupplier.suppliername;

    if (!name) {
      toast.error("Supplier name is required.");
      return;
    }

    const isDuplicate = suppliers.some(p =>
      p.suppliername === name &&
      (!editSupplierId || p.id !== editSupplierId)
    );

    if (isDuplicate) {
      toast.error("A Supplier with the same name already exists.");
      return;
    }

    if (editSupplierId) {
      axiosInstance.put(`/suppliers/${editSupplierId}`, { suppliername: name })
        .then(() => {
          fetchAllsuppliers();
          toast.success("Supplier updated successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to update Supplier."));
    } else {
      axiosInstance.post('/suppliers', { suppliername: name })
        .then(() => {
          fetchAllsuppliers();
          toast.success("Supplier added successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to add Supplier."));
    }
  };

  const handleEditSupplier = (Supplier) => {
    seteditSupplierId(Supplier.id);
    setnewSupplier({ suppliername: Supplier.suppliername });
    setShowModal(true);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm("Are you sure you want to delete this Supplier?")) {
      axiosInstance.delete(`/suppliers/${id}`)
        .then(() => {
          fetchAllsuppliers();
          toast.success("Supplier deleted!");
        })
        .catch(() => toast.error("Failed to delete Supplier."));
    }
  };

  const resetForm = () => {
    setnewSupplier({ suppliername: "" });
    seteditSupplierId(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const displayedsuppliers = suppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <h5>Suppliers</h5>
                    <button className="btn btn-primary" onClick={() => {
                      seteditSupplierId(null);
                      setnewSupplier({ suppliername: "" });
                      setShowModal(true);
                    }}>
                      Add Supplier
                    </button>
                  </div>
                  <div className="card-body">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Supplier Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedsuppliers.map((Supplier, index) => (
                          <tr key={Supplier.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{Supplier.suppliername}</td>
                            <td>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditSupplier(Supplier)}>Edit</button>
                              
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                          <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                          <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {showModal && (
                  <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{editSupplierId ? 'Edit Supplier' : 'Add Supplier'}</h5>
                          <button type="button" className="btn-close" onClick={resetForm}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group mb-2">
                            <label>Supplier Name</label>
                            <input
                              type="text"
                              name="suppliername"
                              className="form-control"
                              onChange={handleSupplierChange}
                              value={newSupplier.suppliername}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                          <button className="btn btn-success" onClick={handleSaveSupplier}>
                            {editSupplierId ? 'Update' : 'Save'}
                          </button>
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

export default Suppliers;
