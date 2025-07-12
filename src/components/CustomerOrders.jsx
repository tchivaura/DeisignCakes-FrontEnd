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
    orderperson: 1,
    price: '',
    quantity: '',
    extrainstructions: '',
    customerId: customer.id,
    orderstatus: 'Pending',
    onClick:'',
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
  complaint: '',
  date:new Date().toISOString().split('T')[0]

});
const[LovedOneDetails,setLovedOneDetails]= useState({
   FullName:'',
   Relationship:'',
   DOB :'',
   Contact:'',
   gengder:''
})

  const ordersPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [customer.id]);

  const fetchData = () => {
    axiosInstance.get(`/Products`).then((res) => setProducts(res.data));
    axiosInstance.get(`/lovedOnes/${customer.id}`).then((res) => setLovedOnes(res.data));
    axiosInstance.get(`/ProductSizes`).then((res) => setProductSizes(res.data));
    axiosInstance.get(`/orders/bycustomer/${customer.id}`).then((res) => setCustomerOrders(res.data));
    axiosInstance.get(`/ProductPrices`).then((res) => setProductPrices(res.data));
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...OrderForm, [name]: value };
    
    setOrderForm(updatedForm);
  };

  const handleCustomerSubmit = async (e) => {
  e.preventDefault();
  let finalOrderForm = { ...OrderForm };

  if (OrderForm.orderperson === 'other') {
    const newLovedOne = {
      fullName: LovedOneDetails.FullName,
      relationship: LovedOneDetails.Relationship,
      customerId: customer.id,
      dob: LovedOneDetails.DOB,
      gender:LovedOneDetails.gender
    };

    try {
      const response = await axiosInstance.post('/LovedOnes', newLovedOne); // 
      const createdLovedOne = response.data;
      finalOrderForm.orderperson = createdLovedOne.id; // 
    } catch (error) {
      toast.error('Failed to create loved one');
      console.error('Error creating loved one:', error);
      return; // Stop submission if error
    }
  }

  try {
    if (editMode) {
      await axiosInstance.put(`/orders/${editId}`, finalOrderForm);
      toast.success('Order Updated');
    } else {
      await axiosInstance.post(`/orders`, finalOrderForm);
      toast.success('Order Added');
    }
    resetForm();
    setEditMode(false);
    setEditId(null);
    resetLovedOneForm();
    fetchData();
  } catch (error) {
    toast.error('Failed to save order');
    console.error(error);
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
      orderperson: 1,
      price: '',
      quantity: '',
      extrainstructions: '',
      customerId: customer.id,
      orderstatus: 'Pending',
      occasion:'',
      clerk : window.localStorage.getItem("username")
    });
  };
  const resetLovedOneForm=()=>{
    setLovedOneDetails({
      FullName:'',
   Relationship:'',
   DOB :'',
   Contact:'111',
   gender:''
    })
  }
  const handleComplaintClick = (order) => {
    setComplaintData({
      customerId: order.customerid,
      orderId: order.id,
      complaint: '',
       date: formatDate(order.orderdate)
    });
    setShowComplaintModal(true);
  };

  const handleComplaintChange = (e) => {
    setComplaintData({ ...complaintData, complaint: e.target.value });
  };

  const handleSubmitComplaint = async () => {
    console.log(complaintData);
    try {
      await axiosInstance.post('/complaints', complaintData);
      setShowComplaintModal(false);
      toast.success('Complaint submitted successfully!');
      
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
    const productName = product ? product.productName : '';
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
                  <th>Occasion</th>
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
                    <td>{Products.find((p) => p.id == order.orderproduct)?.productName}</td>
                    <td>{ProductSizes.find((s) => s.id == order.size)?.size}</td>
                    <td>{order.quantity}</td>
                    <td>
  {Number(order.orderperson) === 1
    ? 'Self'
    : LovedOnes.find((l) => Number(l.id) === Number(order.orderperson))?.fullName || 'Other'}
</td>

                    <td>{order.extrainstructions}</td>
                    <td>{order.occasion}</td>
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
    <div
  className="modal fade"
  id="orderModal"
  tabIndex="-1"
  aria-labelledby="orderModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div
      className="modal-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
      }}
    >
      <form
        onSubmit={handleCustomerSubmit}
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h5 className="modal-title">{editMode ? 'Edit Order' : 'Add Order'}</h5>
        </div>

        {/* Modal Body (Scrollable) */}
        <div
          className="modal-body"
          style={{
            overflowY: 'auto',
            flexGrow: 1,
            paddingBottom: '1rem',
          }}
        >
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Order Date</label>
              <input
                type="datetime-local"
                className="form-control"
                name="orderdate"
                value={OrderForm.orderdate}
                onChange={handleOrderChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Product</label>
              <select
                className="form-control"
                name="orderproduct"
                value={OrderForm.orderproduct}
                onChange={handleOrderChange}
                required
              >
                <option value="">Select</option>
                {Products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Size</label>
              <select
                className="form-control"
                name="size"
                value={OrderForm.size}
                onChange={handleOrderChange}
                required
              >
                <option value="">Select</option>
                {ProductSizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.size}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Order Person</label>
              <select
                className="form-control"
                name="orderperson"
                value={OrderForm.orderperson}
                onChange={handleOrderChange}
                required
              >
                <option value="1">Self</option>
                {LovedOnes.map((lovedOne) => (
                  <option key={lovedOne.id} value={lovedOne.id}>
                    {lovedOne.fullName}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={OrderForm.quantity}
                onChange={handleOrderChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Price</label>
              <input
                type="text"
                className="form-control"
                name="price"
                value={OrderForm.price}
                onChange={handleOrderChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Extra Instructions</label>
              <textarea
                className="form-control"
                name="extrainstructions"
                value={OrderForm.extrainstructions}
                onChange={handleOrderChange}
              ></textarea>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Occasion</label>
              <textarea
                className="form-control"
                name="occasion"
                value={OrderForm.occasion}
                onChange={handleOrderChange}
              ></textarea>
            </div>
          </div>

          {/* Conditionally show Loved One Fields */}
          {OrderForm.orderperson === 'other' && (
  <div className="mt-3">
    <h5>Loved One Details</h5>
    <div className="row">
      <div className="col-md-4 mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          name="FullName"
          value={LovedOneDetails.FullName}
          onChange={(e) =>
            setLovedOneDetails({
              ...LovedOneDetails,
              FullName: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">Relationship</label>
        <input
          type="text"
          className="form-control"
          name="Relationship"
          value={LovedOneDetails.Relationship}
          onChange={(e) =>
            setLovedOneDetails({
              ...LovedOneDetails,
              Relationship: e.target.value,
            })
          }
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">DOB</label>
        <input
          type="date"
          className="form-control"
          name="DOB"
          value={LovedOneDetails.DOB}
          onChange={(e) =>
            setLovedOneDetails({
              ...LovedOneDetails,
              DOB: e.target.value,
            })
          }
        />
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label">Gender</label>
        <select
          className="form-control"
          name="gender"
          value={LovedOneDetails.gender}
          onChange={(e) =>
            setLovedOneDetails({
              ...LovedOneDetails,
              gender: e.target.value,
            })
          }
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    </div>
  </div>
)}

        </div>

        {/* Sticky Footer */}
        <div
          className="modal-footer justify-content-center"
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1050,
            borderTop: '1px solid #dee2e6',
          }}
        >
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Update Order' : 'Save Order'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={() => {
              setEditMode(false);
              resetForm();
            }}
          >
            Close
          </button>
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
