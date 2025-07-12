import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../api/axios';
import 'react-toastify/dist/ReactToastify.css';

function PaymentTypes() {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  const fetchPaymentTypes = () => {
    axiosInstance.get('/paymenttypes')
      .then(res => setPaymentTypes(res.data))
      .catch(err => console.error('Error fetching payment types', err));
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Payment type name is required.");
      return;
    }

    const isDuplicate = paymentTypes.some(
      pt => pt.name.toLowerCase() === trimmedName.toLowerCase() && pt.id !== editId
    );

    if (isDuplicate) {
      toast.error("Duplicate payment type not allowed.");
      return;
    }

    if (editId) {
      axiosInstance.put(`/paymenttypes/${editId}`, { id: editId, name: trimmedName })
        .then(() => {
          toast.success("Payment type updated!");
          resetForm();
          fetchPaymentTypes();
        })
        .catch(() => toast.error("Failed to update payment type."));
    } else {
      axiosInstance.post('/paymenttypes', { name: trimmedName })
        .then(() => {
          toast.success("Payment type added!");
          resetForm();
          fetchPaymentTypes();
        })
        .catch(() => toast.error("Failed to add payment type."));
    }
  };

  const handleEdit = (pt) => {
    setEditId(pt.id);
    setName(pt.name);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment type?")) {
      axiosInstance.delete(`/paymenttypes/${id}`)
        .then(() => {
          toast.success("Payment type deleted!");
          fetchPaymentTypes();
        });
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setShowModal(false);
  };

  return (

<div className="pcoded-main-container">
<ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
    
    
             < div className="container mt-3">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Payment Types</h5>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Payment Type</button>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {paymentTypes.map((pt, index) => (
                <tr key={pt.id}>
                  <td>{index + 1}</td>
                  <td>{pt.name}</td>
                  {/* <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(pt)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pt.id)}>Delete</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit Payment Type' : 'Add Payment Type'}</h5>
                <button className="btn-close" onClick={resetForm}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter payment type name"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button className="btn btn-success" onClick={handleSave}>
                  {editId ? 'Update' : 'Save'}
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
    </div>
  );
}

export default PaymentTypes;
