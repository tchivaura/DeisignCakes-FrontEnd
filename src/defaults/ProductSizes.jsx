import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../api/axios';
import 'react-toastify/dist/ReactToastify.css';

function ProductSizes() {
  const [productsizes, setproductsizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProductSizeId, seteditProductSizeId] = useState(null);
  const [newProductSize, setnewProductSize] = useState({ size: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllproductsizes();
  }, []);

  const fetchAllproductsizes = () => {
    axiosInstance.get('/productsizes')
      .then(res =>
      
         
         setproductsizes(res.data)
  )
      .catch(err => console.log(err));
  };

  const handeProductSizeChange = (e) => {
    const { name, value } = e.target;
    setnewProductSize(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProductSize = () => {
    const name = newProductSize.size;

    if (!name) {
      toast.error("ProductSize is required.");
      return;
    }

    const isDuplicate = productsizes.some(p =>
      p.size === name &&
      (!editProductSizeId || p.id !== editProductSizeId)
    );

    if (isDuplicate) {
      toast.error("A ProductSize already exists.");
      return;
    }

    if (editProductSizeId) {
      axiosInstance.put(`/productsizes/${editProductSizeId}`, { size: name })
        .then(() => {
          fetchAllproductsizes();
          toast.success("ProductSize updated successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to update ProductSize."));
    } else {
      axiosInstance.post('/productsizes', { size: name })
        .then(() => {
          fetchAllproductsizes();
          toast.success("ProductSize added successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to add ProductSize."));
    }
  };

  const handleEditProductSize = (ProductSize) => {
    seteditProductSizeId(ProductSize.id);
    setnewProductSize({ size: ProductSize.size });
    setShowModal(true);
  };

  const handleDeleteProductSize = (id) => {
    if (window.confirm("Are you sure you want to delete this ProductSize?")) {
      axiosInstance.delete(`/productsizes/${id}`)
        .then(() => {
          fetchAllproductsizes();
          toast.success("ProductSize deleted!");
        })
        .catch(() => toast.error("Failed to delete ProductSize."));
    }
  };

  const resetForm = () => {
    setnewProductSize({ size: "" });
    seteditProductSizeId(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(productsizes.length / itemsPerPage);
  const displayedproductsizes = productsizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <h5>Product Sizes</h5>
                    <button className="btn btn-primary" onClick={() => {
                      seteditProductSizeId(null);
                      setnewProductSize({ size: "" });
                      setShowModal(true);
                    }}>
                      Add ProductSize
                    </button>
                  </div>
                  <div className="card-body">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Size</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {displayedproductsizes.map((ProductSize, index) => (
                          <tr key={ProductSize.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{ProductSize.size}</td>
                            
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
                          <h5 className="modal-title">{editProductSizeId ? 'Edit ProductSize' : 'Add ProductSize'}</h5>
                          <button type="button" className="btn-close" onClick={resetForm}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group mb-2">
                            <label>ProductSize Name</label>
                            <input
                              type="text"
                              name="size"
                              className="form-control"
                              onChange={handeProductSizeChange}
                              value={newProductSize.size}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                          <button className="btn btn-success" onClick={handleSaveProductSize}>
                            {editProductSizeId ? 'Update' : 'Save'}
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

export default ProductSizes;
