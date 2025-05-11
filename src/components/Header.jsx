import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';



export default function Header() {
  
  const navigate=useNavigate();
  const [username, setUsername] = useState("");

useEffect(() => {
  setUsername(localStorage.getItem("username"));
}, []);


  const handleLogout=()=>{
    window.localStorage.clear();
    
  
  }



  return (
    <header className="navbar pcoded-header navbar-expand-lg navbar-light headerpos-fixed">
  
  <a className="mobile-menu" id="mobile-header" href="#!">
    <i className="feather icon-more-horizontal" />
  </a>
  <div className="collapse navbar-collapse">
    
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <div className="top-heading">
          <h4>DESIGN CAKES MANAGEMENT SYSTEM</h4>
        </div>
      </li>
    </ul>
    <ul className="navbar-nav ml-auto">
      
      <li>
        <div className="dropdown drp-user">
          <a href="#!" className="dropdown-toggle" data-toggle="dropdown"  onClick={handleLogout}>
            <i className="icon feather icon-user" />
          </a>
          <div className="dropdown-menu dropdown-menu-right profile-notification">
            <div className="pro-head">
              
              <span>{username}</span>
              <a href="/login" className="dud-logout" title="Logout">
                <i className="feather icon-log-out" />
              </a>
            </div>
            
            
          </div>
        </div>
      </li>
    </ul>
  </div>
</header>

  )
}
