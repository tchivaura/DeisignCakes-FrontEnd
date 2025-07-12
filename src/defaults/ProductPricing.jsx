import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axios';

function ProductPricing() {
  const [productPricing, setProductPricing] = useState([]);
  const [filteredPricing, setFilteredPricing] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPricingId, setEditPricingId] = useState(null);
  const [newPricing, setNewPricing] = useState({ productId: '', sizeId: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllProductPricing();
    fetchAllProducts();
    fetchAllSizes();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPricing(productPricing);
      setCurrentPage(1);
      return;
    }
    if (products.length === 0) return;

    const filtered = productPricing.filter((pricing) => {
      const prod = products.find((p) => p.id === pricing.productId);
      return prod
        ? prod.productName.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    });

    setFilteredPricing(filtered);
    setCurrentPage(1);
  }, [searchTerm, productPricing, products]);

  const fetchAllProductPricing = () => {
    axiosInstance
      .get('/ProductPrices')
      .then((res) => {
        setProductPricing(res.data);
        setFilteredPricing(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchAllProducts = () => {
    axiosInstance
      .get('/Products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  const fetchAllSizes = () => {
    axiosInstance
      .get('/ProductSizes')
      .then((res) => setSizes(res.data))
      .catch((err) => console.log(err));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setNewPricing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePricing = () => {
    const { productId, sizeId, price } = newPricing;

    if (!productId || !sizeId || !price) {
      toast.error('All fields are required.');
      return;
    }

    const isDuplicate = productPricing.some(
      (p) =>
        p.productId === parseInt(productId) &&
        p.sizeId === parseInt(sizeId) &&
        (!editPricingId || p.id !== editPricingId)
    );

    if (isDuplicate) {
      toast.error('This price already exists for the selected product and size.');
      return;
    }

    const payload = {
      productId: parseInt(productId),
      sizeId: parseInt(sizeId),
      price: price,
    };

    if (editPricingId) {
      axiosInstance
        .put(`/ProductPrices/${editPricingId}`, payload)
        .then(() => {
          fetchAllProductPricing();
          toast.success('Pricing updated successfully!');
          resetForm();
        })
        .catch(() => toast.error('Failed to update pricing.'));
    } else {
      axiosInstance
        .post('/ProductPrices', payload)
        .then(() => {
          fetchAllProductPricing();
          toast.success('Pricing added successfully!');
          resetForm();
        })
        .catch(() => toast.error('Failed to add pricing.'));
    }
  };

  const handleEditPricing = (pricing) => {
    setEditPricingId(pricing.id);
    setNewPricing({
      productId: pricing.productId.toString(),
      sizeId: pricing.sizeId.toString(),
      price: pricing.price,
    });
    setShowModal(true);
  };

  const handleDeletePricing = (id) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      axiosInstance.delete(`/ProductPrices/${id}`).then(() => {
        fetchAllProductPricing();
        toast.success('Pricing deleted!');
      });
    }
  };

  const resetForm = () => {
    setNewPricing({ productId: '', sizeId: '', price: '' });
    setEditPricingId(null);
    setShowModal(false);
  };

  const totalPages = Math.ceil(filteredPricing.length / itemsPerPage);
  const displayedPricing = filteredPricing.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                    <label htmlFor="order-search-input" className="form-label">
                      Search Pricing
                    </label>
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
                    <h5>Product Pricing</h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditPricingId(null);
                        setNewPricing({ productId: '', sizeId: '', price: '' });
                        setShowModal(true);
                      }}
                    >
                      Add Pricing
                    </button>
                  </div>
                  <div className="card-body">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Size</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedPricing.map((pricing, index) => (
                          <tr key={pricing.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{products.find((p) => p.id === pricing.productId)?.productName || 'Unknown'}</td>
                            <td>{sizes.find((s) => s.id === pricing.sizeId)?.size || 'Unknown'}</td>
                            <td>{pricing.price}</td>
                            <td>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditPricing(pricing)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDeletePricing(pricing.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                          <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
                            Next
                          </button>
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
                          <h5 className="modal-title">{editPricingId ? 'Edit Pricing' : 'Add Pricing'}</h5>
                          <button type="button" className="btn-close" onClick={resetForm}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group mb-2">
                            <label>Product</label>
                            <select name="productId" className="form-control" onChange={handlePricingChange} value={newPricing.productId}>
                              <option value="">Select Product</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.productName}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group mb-2">
                            <label>Size</label>
                            <select name="sizeId" className="form-control" onChange={handlePricingChange} value={newPricing.sizeId}>
                              <option value="">Select Size</option>
                              {sizes.map((size) => (
                                <option key={size.id} value={size.id}>{size.size}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group mb-2">
                            <label>Price</label>
                            <input type="text" name="price" className="form-control" onChange={handlePricingChange} value={newPricing.price} />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                          <button className="btn btn-primary" onClick={handleSavePricing}>Save</button>
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

export default ProductPricing;
