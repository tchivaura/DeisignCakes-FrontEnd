import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    firstName: '',
    surname: '',
    address: '',
    telephone: '',
    gender: '',
    dob: '',
    base: '',
    label: ''
  });

  const [labels, setLabels] = useState([]);
  const [lovedOnes, setLovedOnes] = useState([]);
  const [newLovedOne, setNewLovedOne] = useState({
    fullName: '',
    relationship: '',
    contact: ''
  });
  const [editingLovedOne, setEditingLovedOne] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/customers/${id}`).then(res => {
      setCustomer(res.data);
    });

    axiosInstance.get(`/lovedOnes?customerId=${id}`).then(res => {
      setLovedOnes(res.data);
    });

    axiosInstance.get(`/labels`).then(res => {
      setLabels(res.data);
    });
  }, [id]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`/customers/${id}`, customer).then(() => {
      toast.success('Customer updated successfully!');
    });
  };

  const handleLovedOneChange = (e) => {
    const { name, value } = e.target;
    if (editingLovedOne) {
      setEditingLovedOne({ ...editingLovedOne, [name]: value });
    } else {
      setNewLovedOne({ ...newLovedOne, [name]: value });
    }
  };

  const handleAddLovedOne = (e) => {
    e.preventDefault();
    axiosInstance.post('/lovedOnes', {
      ...newLovedOne,
      customerId: id
    }).then(res => {
      setLovedOnes([...lovedOnes, res.data]);
      setNewLovedOne({ fullName: '', relationship: '', contact: '' });
      toast.success('Loved one added!');
    });
  };

  const handleEditLovedOne = (e) => {
    e.preventDefault();
    axiosInstance.put(`/lovedOnes/${editingLovedOne.id}`, editingLovedOne).then(() => {
      const updated = lovedOnes.map(lo =>
        lo.id === editingLovedOne.id ? editingLovedOne : lo
      );
      setLovedOnes(updated);
      setEditingLovedOne(null);
      toast.success('Loved one updated!');
    });
  };

  const handleDeleteLovedOne = (idToDelete) => {
    axiosInstance.delete(`/lovedOnes/${idToDelete}`).then(() => {
      const filtered = lovedOnes.filter(lo => lo.id !== idToDelete);
      setLovedOnes(filtered);
      toast.success('Loved one deleted!');
    });
  };

  return (
    <div className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">

                {/* Back Button */}
               

                {/* Customer Form */}
                <div className="card">
                  <div className="card-header"><h5>Edit Customer</h5></div>
                  <div className="card-body">
                    <form onSubmit={handleCustomerSubmit}>
                      <div className="row mb-3">
                       
                          <div className="col-md-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="firstName"
                              name="firstName"
                              value={customer.firstName}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="surname" className="form-label">Surname</label>
                            <input
                              type="text"
                              className="form-control"
                              id="surname"
                              name="surname"
                              value={customer.surname}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          
                          <div className="col-md-3">
                            <label htmlFor="telephone" className="form-label">Telephone</label>
                            <input
                              type="text"
                              className="form-control"
                              id="telephone"
                              name="telephone"
                              value={customer.telephone}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          <div className="col-md-3">
  <label htmlFor="gender" className="form-label">Gender</label>
  <select
    className="form-control"
    id="gender"
    name="gender"
    value={customer.gender}
    onChange={handleCustomerChange}
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
</div>
</div>
<div className="row mb-3">
                        
                          
                          <div className="col-md-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              name="address"
                              value={customer.address}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              id="dob"
                              name="dob"
                              value={customer.dob}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="base" className="form-label">Base</label>
                            <input
                              type="text"
                              className="form-control"
                              id="base"
                              name="base"
                              value={customer.base}
                              onChange={handleCustomerChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="label" className="form-label">Label</label>
                            <select
                              className="form-control"
                              id="label"
                              name="label"
                              value={customer.label}
                              onChange={handleCustomerChange}
                            >
                              <option value="">Select Label</option>
                              {labels.map(label => (
                                <option key={label.id} value={label.labelname}>{label.labelname}</option>
                              ))}
                            </select>
                          
                        </div>
                        </div>
                        <div className="row mb-3">
                        <div className="col-md-12" style={{"alignItems" :"center","margin-left":"500px"}}>
                          <button type="submit" className="btn btn-primary">Save Changes</button>
                          <button type="button" className="btn btn-primary" onClick={() => navigate('/customers')}>
                    Back to Customers
                  </button>
                        </div>
                        </div>
                     
                    </form>
                  </div>
                </div>

                {/* Loved Ones Table */}
                <div className="card mt-4">
                  <div className="card-header d-flex justify-content-between">
                    <h5>Loved Ones</h5>
                    <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#addLovedOneModal">
                      Add Loved One
                    </button>
                  </div>
                  <div className="card-body table-border-style">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Full Name</th>
                          <th>Relationship</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lovedOnes.map((lo, index) => (
                          <tr key={lo.id}>
                            <td>{index + 1}</td>
                            <td>{lo.fullName}</td>
                            <td>{lo.relationship}</td>
                            <td>{lo.contact}</td>
                            <td>
                            <i 
                  className="fas fa-edit fa-lg me-5 text-primary "  
                  data-bs-toggle="modal" 
                  data-bs-target="#editLovedOneModal" 
                  onClick={() => setEditingLovedOne(lo)}
              ></i>

              <i 
                 className="fas fa-trash fa-lg text-danger"  style={{"margin-left":"5px"}}
                 onClick={() => handleDeleteLovedOne(lo.id)}
              ></i>

                              
                              
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Loved One Modal */}
                <div className="modal fade" id="addLovedOneModal" tabIndex="-1" aria-hidden="true">
                  <div className="modal-dialog">
                    <form onSubmit={handleAddLovedOne} className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Add Loved One</h5>
                        
                      </div>
                      <div className="modal-body d-flex flex-column align-items-center">
                      <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                     <input type="text" required className="form-control" name="fullName" placeholder="Full Name" value={newLovedOne.fullName} onChange={handleLovedOneChange} />
                     </div>
                    <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                    <label htmlFor="relationship" className="form-label">Relationship</label>
                  <input type="text" required className="form-control" name="relationship" placeholder="Relationship" value={newLovedOne.relationship} onChange={handleLovedOneChange} />
               </div>
              <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
               <label htmlFor="contact" className="form-label">Contact</label>
                <input type="text" className="form-control" name="contact" placeholder="Contact" value={newLovedOne.contact} onChange={handleLovedOneChange} />
               </div>
              </div>
                      <div className="modal-footer d-flex justify-content-center" >
                      <button type="submit" className="btn btn-primary" >Save</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        
                      </div>
                    </form>
                  </div>
                </div>

                {/* Edit Loved One Modal */}
                {editingLovedOne && (
                  <div className="modal fade" id="editLovedOneModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                      <form onSubmit={handleEditLovedOne} className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Edit Loved One</h5>
                          
                        </div>
                        <div className="modal-body d-flex flex-column align-items-center" >
                        <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input type="text" className="form-control" name="fullName" placeholder="Full Name" value={editingLovedOne.fullName} onChange={handleLovedOneChange} />
                          </div>
                          <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                            <label htmlFor="relationship" className="form-label">Relationship</label>
                            <input type="text" className="form-control" name="relationship" placeholder="Relationship" value={editingLovedOne.relationship} onChange={handleLovedOneChange} />
                          </div>
                          <div className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                            <label htmlFor="contact" className="form-label">Contact</label>
                            <input type="text" className="form-control" name="contact" placeholder="Contact" value={editingLovedOne.contact} onChange={handleLovedOneChange} />
                          </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">Save</button>
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          
                        </div>
                      </form>
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

export default EditCustomer;
