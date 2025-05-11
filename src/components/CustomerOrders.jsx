import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

function CustomerOrders({ customer }) {
  const [Products, setProducts] = useState([]);
  const [LovedOnes, setLovedOnes] = useState([]);
  const [ProductSizes, setProductSizes] = useState([]);
  const [CustomerOrders, setCustomerOrders] = useState([]);
  const [ProductPrices, setProductPrices] = useState([]);
  const [OrderForm, setOrderForm] = useState({
    orderdate: '',
    orderproduct: '',
    size: '',
    orderperson: 'self',
    price: '',
    quantity: '',
    extrainstructions: '',
    customerId: customer.id,
    orderstatus: 'Pending',
    clerk : window.localStorage.getItem("username")
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintData, setComplaintData] = useState({
  customerId: '',
  orderId: '',
  complaint: ''
});

  const ordersPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [customer.id]);

  const fetchData = () => {
    axiosInstance.get(`/Products`).then((res) => setProducts(res.data));
    axiosInstance.get(`/lovedOnes?customerId=${customer.id}`).then((res) => setLovedOnes(res.data));
    axiosInstance.get(`/ProductSizes`).then((res) => setProductSizes(res.data));
    axiosInstance.get(`/orders?customerId=${customer.id}`).then((res) => setCustomerOrders(res.data));
    axiosInstance.get(`/ProductPrices`).then((res) => setProductPrices(res.data));
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...OrderForm, [name]: value };
    if ((name === "orderproduct" || name === "size") && updatedForm.orderproduct && updatedForm.size) {
      const match = ProductPrices.find(
        (p) => String(p.ProductId) === String(updatedForm.orderproduct) && String(p.SizeId) === String(updatedForm.size)
      );
      updatedForm.price = match ? match.Price : '';
    }
    setOrderForm(updatedForm);
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axiosInstance.put(`/orders/${editId}`, OrderForm).then(() => {
        toast.success('Order Updated');
        resetForm();
        setEditMode(false);
        setEditId(null);
        fetchData();
      });
    } else {
      axiosInstance.post(`/orders`, OrderForm).then(() => {
        toast.success('Order Added');
        resetForm();
        fetchData();
      });
    }
  };

  const handleEdit = (order) => {
    setOrderForm(order);
    setEditId(order.id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      axiosInstance.delete(`/orders/${id}`).then(() => {
        toast.warn('Order Cancelled');
        fetchData();
      });
    }
  };

  const resetForm = () => {
    setOrderForm({
      orderdate: '',
      orderproduct: '',
      size: '',
      orderperson: 'self',
      price: '',
      quantity: '',
      extrainstructions: '',
      customerId: customer.id,
      orderstatus: 'Pending',
      clerk : window.localStorage.getItem("username")
    });
  };
  const handleComplaintClick = (order) => {
    setComplaintData({
      customerId: order.customerId,
      orderId: order.id,
      complaint: ''
    });
    setShowComplaintModal(true);
  };

  const handleComplaintChange = (e) => {
    setComplaintData({ ...complaintData, complaint: e.target.value });
  };

  const handleSubmitComplaint = async () => {
    try {
      await axiosInstance.post('/complaints', complaintData);
      toast.success('Complaint submitted successfully!');
      setShowComplaintModal(false);
    } catch (error) {
      toast.error('Failed to submit complaint');
      console.error(error);
    }
  };
  
  

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = CustomerOrders.filter((order) => {
    const product = Products.find((p) => p.id == order.orderproduct);
    const productName = product ? product.ProductName : '';
    return (
      (!statusFilter || order.orderstatus === statusFilter) &&
      (!productFilter || productName.toLowerCase().includes(productFilter.toLowerCase()))
    );
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const dateKey = new Date(order.orderdate).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(order);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));
  const allGrouped = sortedGroupKeys.flatMap(date => groupedOrders[date]);

  const totalPages = Math.ceil(allGrouped.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentGroupSlice = allGrouped.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <>
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Customer Orders</h5>
          <button className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#orderModal"
            onClick={() => { resetForm(); setEditMode(false); }}>
            Add Order
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label">Filter by Status</label>
              <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Billed">Billed</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Product Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Person</th>
                  <th>Instructions</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Operator</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentGroupSlice.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{formatDate(order.orderdate)}</td>
                    <td>{Products.find((p) => p.id == order.orderproduct)?.ProductName}</td>
                    <td>{ProductSizes.find((s) => s.id == order.size)?.size}</td>
                    <td>{order.quantity}</td>
                    <td>{order.orderperson === 'self' ? 'Self' : LovedOnes.find((l) => l.id == order.orderperson)?.fullName}</td>
                    <td>{order.extrainstructions}</td>
                    <td>{order.price}</td>
                    <td>{order.orderstatus}</td>
                    <td>{order.clerk}</td>
                    <td>
                      {order.orderstatus !== 'Billed' ? (
                        <>
                          <button className="btn btn-sm btn-info me-1" data-bs-toggle="modal" data-bs-target="#orderModal"
                            onClick={() => handleEdit(order)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-info me-1" data-bs-toggle="modal"  data-bs-target="#complaintModal" onClick={() => handleComplaintClick(order)}
                        >
                        Add Complaint
                      </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      <div className="modal fade" id="orderModal" tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <form onSubmit={handleCustomerSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editMode ? 'Edit Order' : 'Add Order'}</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Order Date</label>
                    <input type="datetime-local" className="form-control" name="orderdate"
                      value={OrderForm.orderdate} onChange={handleOrderChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Product</label>
                    <select className="form-control" name="orderproduct" value={OrderForm.orderproduct}
                      onChange={handleOrderChange} required>
                      <option value="">Select</option>
                      {Products.map((product) => (
                        <option key={product.id} value={product.id}>{product.ProductName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Size</label>
                    <select className="form-control" name="size" value={OrderForm.size}
                      onChange={handleOrderChange} required>
                      <option value="">Select</option>
                      {ProductSizes.map((size) => (
                        <option key={size.id} value={size.id}>{size.size}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Order Person</label>
                    <select className="form-control" name="orderperson" value={OrderForm.orderperson}
                      onChange={handleOrderChange} required>
                      <option value="self">Self</option>
                      {LovedOnes.map((lovedOne) => (
                        <option key={lovedOne.id} value={lovedOne.id}>{lovedOne.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" name="quantity"
                      value={OrderForm.quantity} onChange={handleOrderChange} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Price</label>
                    <input type="text" className="form-control" name="price" value={OrderForm.price} readOnly />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Extra Instructions</label>
                    <textarea className="form-control" name="extrainstructions"
                      value={OrderForm.extrainstructions} onChange={handleOrderChange} rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">{editMode ? 'Update Order' : 'Save Order'}</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                  onClick={() => { setEditMode(false); resetForm(); }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="complaintModal"
        tabIndex="-1"
        aria-labelledby="complaintModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="complaintModalLabel">Add Complaint</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowComplaintModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                
                <input
                  type="hidden"
                  className="form-control"
                  value={complaintData.customerId}
                  readOnly
                />
              </div>
              <div className="mb-3">
                
                <input
                  type="hidden"
                  className="form-control"
                  value={complaintData.orderId}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Complaint</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={complaintData.complaint}
                  onChange={handleComplaintChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setShowComplaintModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitComplaint}
              >
                Submit Complaint
              </button>
            </div>
            </div>
            </div>
            </div>
    </>
  );
}

export default CustomerOrders;
