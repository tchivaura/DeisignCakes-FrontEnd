import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../api/axios';
import 'react-toastify/dist/ReactToastify.css';


function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsizes, setProductSizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({ ProductName: "", Size: "", Prize: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllProducts();
    fetchAllProductSizes();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchAllProducts = () => {
    axiosInstance.get('/Products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  const fetchAllProductSizes = () => {
    axiosInstance.get('/ProductSizes')
      .then(res => setProductSizes(res.data))
      .catch(err => console.log(err));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = () => {
    const trimmedName = newProduct.ProductName.trim().toLowerCase();
    const selectedSize = newProduct.Size;
  
    if (!trimmedName) {
      toast.error("Product name is required.");
      return;
    }
  
    if (!selectedSize) {
      toast.error("Product size is required.");
      return;
    }
  
    if (!newProduct.Prize) {
      toast.error("Price is required.");
      return;
    }
  
    const isDuplicate = products.some(p =>
      p.ProductName.trim().toLowerCase() === trimmedName &&
      p.Size.toString() === selectedSize.toString() &&
      (!editProductId || p.id !== editProductId)
    );
  
    if (isDuplicate) {
      toast.error("A product with the same name and size already exists.");
      return;
    }
  
    if (editProductId) {
      axiosInstance.put(`/Products/${editProductId}`, newProduct)
        .then(() => {
          fetchAllProducts();
          toast.success("Product updated successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to update product."));
    } else {
      axiosInstance.post('/Products', newProduct)
        .then(() => {
          fetchAllProducts();
          toast.success("Product added successfully!");
          resetForm();
        })
        .catch(() => toast.error("Failed to add product."));
    }
  };
  
  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setNewProduct({ ProductName: product.ProductName, Size: product.Size, Prize: product.Prize });
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axiosInstance.delete(`/Products/${id}`)
        .then(() => {
          fetchAllProducts();
          toast.success("Product deleted!");
        });
    }
  };

  const resetForm = () => {
    setNewProduct({ ProductName: "", Size: "", Prize: "" });
    setEditProductId(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
              <div className="row">
                  <div className="col-md-4 position-relative">
                    <label htmlFor="order-search-input" className="form-label">Search Product</label>
                    <input
                      type="text"
                      placeholder="Search by Product Name"
                      className="form-control mb-3"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                    </div>
                <div className="card">
                  <div className="card-header d-flex justify-content-between">
                    <h5>Products</h5>
                    <button className="btn btn-primary" onClick={() => {
                      setEditProductId(null);
                      setNewProduct({ ProductName: "", Size: "", Prize: "" });
                      setShowModal(true);
                    }}>
                      Add Product
                    </button>
                  </div>
                  <div className="card-body">
                    
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Product Size</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedProducts.map((product, index) => (
                          <tr key={product.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{product.ProductName}</td>
                            <td>{productsizes.find(size => size.id === product.Size)?.size || 'Unknown'}</td>
                            <td>{product.Prize}</td>
                            <td>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditProduct(product)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
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
                          <h5 className="modal-title">{editProductId ? 'Edit Product' : 'Add Product'}</h5>
                          <button type="button" className="btn-close" onClick={resetForm}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group mb-2">
                            <label>Product Name</label>
                            <input
                              type="text"
                              name="ProductName"
                              className="form-control"
                              onChange={handleProductChange}
                              value={newProduct.ProductName}
                            />
                          </div>
                          <div className="form-group mb-2">
                            <label>Product Size</label>
                            <select
                              name="Size"
                              className="form-control"
                              onChange={handleProductChange}
                              value={newProduct.Size}
                            >
                              <option value="">Select Size</option>
                              {productsizes.map((productsize) => (
                                <option key={productsize.id} value={productsize.id}>
                                  {productsize.size}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group mb-2">
                            <label>Price</label>
                            <input
                              type="number"
                              className="form-control"
                              name="Prize"
                              onChange={handleProductChange}
                              value={newProduct.Prize}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                          <button className="btn btn-success" onClick={handleSaveProduct}>
                            {editProductId ? 'Update' : 'Save'}
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

export default Products;
