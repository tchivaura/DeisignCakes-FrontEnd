import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axios';

function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    Role: ''
  });

  useEffect(() => {
    fetchAllUsers();
    fetchRoles();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get('/roles');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await axiosInstance.put(`/users/${editingUser.id}`, newUser);
        toast.success('User updated successfully');
      } else {
        await axiosInstance.post('/users', newUser);
        toast.success('User added successfully');
      }
      setModalOpen(false);
      fetchAllUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Error saving user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchAllUsers();
      } catch (err) {
        console.error(err);
        toast.error('Error deleting user');
      }
    }
  };

  const handleEditUser = (user) => {
    setNewUser(user);
    setEditingUser(user);
    setModalOpen(true);
  };

  const resetForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      Role: ''
    });
    setEditingUser(null);
  };

  return (
    <section className="pcoded-main-container">
      <ToastContainer />
      <div className="pcoded-wrapper">
        <div className="pcoded-content">
          <div className="pcoded-inner-content">
            <div className="main-body">
              <div className="page-wrapper">
               
              <div className="card">        
              <div className="card-header d-flex justify-content-between">
              <h5>Users</h5>
                        <button className="btn btn-primary" onClick={() => { resetForm(); setModalOpen(true); }}>
                          Add User
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header">
                        <h5>Current Users</h5>
                      </div>
                      <div className="card-body table-border-style">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allUsers.map((user, index) => (
                                <tr key={user.id}>
                                  <td>{user.id}</td>
                                  <td>{user.firstName}</td>
                                  <td>{user.lastName}</td>
                                  <td>{user.userName}</td>
                                  <td>{user.password}</td>
                                  <td>{user.role}</td>
                                  <td>
                                    <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditUser(user)}>Edit</button>
                                    
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                {modalOpen && (
                  <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{editingUser ? 'Edit User' : 'Add User'}</h5>
                          <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" className="form-control" value={newUser.firstName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" className="form-control" value={newUser.lastName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="userName" className="form-control" value={newUser.userName} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Password</label>
                            <input type="text" name="password" className="form-control" value={newUser.password} onChange={handleInputChange} />
                          </div>
                          <div className="form-group">
                            <label>Role</label>
                            <select name="Role" className="form-control" value={newUser.Role} onChange={handleInputChange}>
                              <option value="">-- Select Role --</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                          <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
                            {editingUser ? 'Update' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            
    </section>
  );
}

export default Users;
