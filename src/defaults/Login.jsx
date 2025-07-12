import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import { ToastContainer } from 'react-toastify';
import { Navigate, useNavigate, useNavigation } from 'react-router-dom';




function Login() {
  const [userForm,setuserForm]=useState(
    {
    userName : "",
    password : ""
    }
  
  );

  const handleChange =(e)=>{
       const{name,value}=e.target;
       setuserForm({...userForm,[name]:value});
      

 
       
  };
  const navigate= useNavigate();
  const isLogin=null;
    

  const handleSubmit = (e)=>{
    e.preventDefault();
    //console.log(userForm);
   
    if (userForm.userName.trim() === "") {
      toast.warn("Please populate username");
      return;
    }
    if (userForm.password.trim() === "") {
      toast.warn("Please populate password");
      return;
    }
    
    axiosInstance.get("/users")
    .then(res => {
      if (res.status === 200 && res.data.length > 0) {
        // Find the matching user
        const user = res.data.find(u => u.userName === userForm.userName && u.password === userForm.password);
        
        if (user) {
          window.localStorage.setItem("loggedin", true);
          window.localStorage.setItem("role", user.role); 
          window.localStorage.setItem("username", user.userName);
        
          navigate("/dashboard");
        } else {
          toast.warn("Username or password is incorrect");
        }
      } else {
        toast.warn("No users found");
      }
    })
    .catch(error => {
      console.error(error);
      toast.error("An error occurred during login");
    });
  
    

  }

  



  return (
    <div className="auth-wrapper">
        <ToastContainer />
  <div className="auth-content container">
    <div className="card">
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="card-body">
            <img
              src="../assets/images/logo-dark.png"
              alt=""
              className="img-fluid mb-4"
            />
            <h4 className="mb-3 f-w-400">DESIGN CAKES</h4>
            <form onSubmit={handleSubmit}>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather icon-mail" />
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                name="userName"
                placeholder="Username"
                value={userForm.userName}
                onChange={handleChange}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather icon-lock" />
                </span>
              </div>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={userForm.password}
                onChange={handleChange}
              />
            </div>
           
            <button className="btn btn-primary mb-4" type='submit'>Login</button>
            </form>
          
          </div>
          
        </div>
        
        <div className="col-md-6 d-none d-md-block">
          <img
            src="/assests/images/choco.jpg"
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default Login