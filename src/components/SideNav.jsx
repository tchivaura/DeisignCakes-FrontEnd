import React from 'react';

function SideNav({ role }) {
  return (
    <nav className="pcoded-navbar menupos-fixed menu-light brand-blue">
      <div className="navbar-wrapper">
        <div className="">
          <a href="index.html" className="b-brand">
            <img src="/assests/images/designlogo_optimized.png" alt="" className="logo images"  />
            {/* <img src="/assests/images/designss_50.jpg" alt="" className="logo images"  /> */}
           
          </a>
          
        </div>
        <div className="navbar-content scroll-div">
          <ul className="nav pcoded-inner-navbar">
            {/* Basic Navigation */}
            <li className="nav-item pcoded-menu-caption">
              <label>Navigation</label>
            </li>
            <li className="nav-item">
              <a href="/dashboard" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-home" />
                </span>
                <span className="pcoded-mtext">Dashboard</span>
              </a>
            </li>

            {/* Orders Management */}
            <li className="nav-item pcoded-menu-caption">
              <label>Orders Management</label>
            </li>
            <li className="nav-item">
              <a href="/ordercreation" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-book" />
                </span>
                <span className="pcoded-mtext">New Order</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/allorders" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-folder" />
                </span>
                <span className="pcoded-mtext">All Orders</span>
              </a>
            </li>

            {/* Finance */}
            <li className="nav-item pcoded-menu-caption">
              <label>Finance</label>
            </li>
            <li className="nav-item">
              <a href="/paymentcreation" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-credit-card" />
                </span>
                <span className="pcoded-mtext">Add Payment</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/allpayments" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-alert-triangle" />
                </span>
                <span className="pcoded-mtext">All Payments</span>
              </a>
            </li>

            {/* Customer Management */}
            <li className="nav-item pcoded-menu-caption">
              <label>Customer Management</label>
            </li>
            <li className="nav-item">
              <a href="/customers" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-briefcase" />
                </span>
                <span className="pcoded-mtext">Customers</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/complains" className="nav-link">
                <span className="pcoded-micon">
                  <i className="feather icon-alert-octagon" />
                </span>
                <span className="pcoded-mtext">Complains</span>
              </a>
            </li>

            {/* System Admin Section */}
            {role === "Admin" && (
              <>
                <li className="nav-item pcoded-menu-caption">
                  <label>System Administration</label>
                </li>
                <li className="nav-item">
                  <a href="/users" className="nav-link">
                    <span className="pcoded-micon">
                      <i className="feather icon-users" />
                    </span>
                    <span className="pcoded-mtext">Users</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/productsprice" className="nav-link">
                    <span className="pcoded-micon">
                      <i className="feather icon-package" />
                    </span>
                    <span className="pcoded-mtext">Pricing</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/paymenttypes" className="nav-link">
                    <span className="pcoded-micon">
                      <i className="feather icon-credit-card" />
                    </span>
                    <span className="pcoded-mtext">Payment Types</span>
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default SideNav;
