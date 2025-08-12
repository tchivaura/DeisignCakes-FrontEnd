import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

function OrderPayments({ orderId, orderPrice, orderQuantity }) {
  const [payments, setPayments] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    paymenttype: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    orderid: orderId,
    clerk : window.localStorage.getItem("username"),
    description:"order"
  });

  const totalPrice = Math.round( parseFloat(orderPrice) * parseInt(orderQuantity),0);

  useEffect(() => {
    fetchPayments();
    fetchPaymentTypes();
  }, [orderId]);

  const fetchPayments = () => {
    axiosInstance.get(`/payments/${orderId}`)
      .then((res) => setPayments(res.data));
  };

  const fetchPaymentTypes = () => {
    axiosInstance.get('/paymenttypes')
      .then((res) => setPaymentTypes(res.data));
  };

  const updateOrderStatus = (totalPaid) => {
    const newStatus = totalPaid >= totalPrice ? 'Billed' : totalPaid > 0 ? 'Partially Paid' : 'Pending';
   
    axiosInstance.patch(`/orders/${orderId}`, { orderstatus: newStatus });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.description="order"
    const amount = parseFloat(form.amount);
    const totalPaidSoFar = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const newTotal = editId ?
      totalPaidSoFar - payments.find(p => p.id === editId)?.amount + amount :
      totalPaidSoFar + amount;

    if (!form.paymenttype || !form.amount) {
      toast.error("All fields are required");
      return;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (newTotal > totalPrice) {
      toast.error("Total payment cannot exceed the order total");
      return;
    }

    if (editId) {
      const editingPayment = payments.find(p => p.id === editId);
      const otherPaymentsTotal = payments.reduce((sum, p) => p.id === editId ? sum : sum + parseFloat(p.amount), 0);

      if (amount + otherPaymentsTotal > totalPrice) {
        toast.error("Updated payment amount exceeds allowed total");
        return;
      }

      axiosInstance.put(`/payments/${editId}`, form)
        .then(() => {
          toast.success("Payment updated");
          setEditId(null);
          resetForm();
          fetchPayments();
        });
    } else {
      axiosInstance.post(`/payments`, form)
        .then(() => {
          console.log(form)
          toast.success("Payment added");
          resetForm();
          fetchPayments();
        });
    }
  };

  useEffect(() => {
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    updateOrderStatus(totalPaid);
  }, [payments]);

  const handleEdit = (payment) => {
    setEditId(payment.id);
    setForm(payment);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      axiosInstance.delete(`/payments/${id}`)
        .then(() => {
          toast.warn("Payment deleted");
          fetchPayments();
        });
    }
  };

  const resetForm = () => {
    setForm({
      paymenttype: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      orderid: orderId,
      clerk : window.localStorage.getItem("username"),
      description:""
      
    });
  };

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const balance = totalPrice - totalPaid;

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>Order Payments</h5>
        <button
          className="btn btn-sm btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#paymentModal"
          onClick={() => {
            setEditId(null);
            resetForm();
          }}
        >
          Add Payment
        </button>
      </div>

      <div className="card-body">
        <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
        <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Payment Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Operator</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No payments recorded yet.</td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>{paymentTypes.find((pt) => pt.id == payment.paymenttype)?.name || 'Unknown'}</td>
                    
                    <td>${parseFloat(payment.amount).toFixed(2)}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>{payment.clerk}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#paymentModal"
                        onClick={() => handleEdit(payment)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="paymentModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editId ? 'Edit Payment' : 'Add Payment'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Payment Type</label>
                <select
                  className="form-control"
                  name="paymenttype"
                  value={form.paymenttype}
                  onChange={handleChange}
                 
                >
                  <option value="">-- Select Payment Type --</option>
                  {paymentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                {editId ? 'Update Payment' : 'Add Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderPayments;
