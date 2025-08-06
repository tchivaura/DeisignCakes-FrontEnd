import React from 'react';
import { NavLink } from 'react-router-dom';

function SideNav({ role }) {
  const getLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <nav className="pcoded-navbar menupos-fixed menu-light brand-blue" style={{ height: '100vh', overflow: 'hidden' }}>
      <div className="navbar-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="logo-container" style={{ flex: '0 0 auto', padding: '10px' }}>
          <div className="logo-container" style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <NavLink to="/dashboard" className="b-brand" style={{ textDecoration: 'none' }}>
    <h3 style={{ margin: 0, fontWeight: 'bold', fontStyle: 'italic', color: '#ff4081' }}>
      DESIGN CAKES
    </h3>
  </NavLink>
</div>


        </div>
        <div
          className="navbar-content scroll-div"
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            paddingRight: '5px',
          }}
        >
          <ul className="nav pcoded-inner-navbar">
            <li className="nav-item pcoded-menu-caption">
              <label>Navigation</label>
            </li>
            <li className="nav-item">
              <NavLink to="/dashboard" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-home" /></span>
                <span className="pcoded-mtext">Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item pcoded-menu-caption">
              <label>Orders Management</label>
            </li>
            <li className="nav-item">
              <NavLink to="/ordercreation" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-shopping-cart" /></span>
                <span className="pcoded-mtext">New Order</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/allorders" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-folder" /></span>
                <span className="pcoded-mtext">All Orders</span>
              </NavLink>
            </li>

            <li className="nav-item pcoded-menu-caption">
              <label>Finance</label>
            </li>
            <li className="nav-item">
              <NavLink to="/paymentcreation" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-credit-card" /></span>
                <span className="pcoded-mtext">Add Customer Payment</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/allpayments" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-folder" /></span>
                <span className="pcoded-mtext">All Customers Payments</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/expenses" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-file-minus" /></span>
                <span className="pcoded-mtext">Expenses</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/alltransactions" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-layers" /></span>
                <span className="pcoded-mtext">All Transactions</span>
              </NavLink>
            </li>

            <li className="nav-item pcoded-menu-caption">
              <label>Customer Management</label>
            </li>
            <li className="nav-item">
              <NavLink to="/customers" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-briefcase" /></span>
                <span className="pcoded-mtext">Customers</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/complains" className={getLinkClass}>
                <span className="pcoded-micon"><i className="feather icon-alert-octagon" /></span>
                <span className="pcoded-mtext">Complains</span>
              </NavLink>
            </li>

            {role === "Admin" && (
              <>
                <li className="nav-item pcoded-menu-caption">
                  <label>System Administration</label>
                </li>
                <li className="nav-item">
                  <NavLink to="/users" className={getLinkClass}>
                    <span className="pcoded-micon"><i className="feather icon-users" /></span>
                    <span className="pcoded-mtext">Users</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/products" className={getLinkClass}>
                    <span className="pcoded-micon"><i className="feather icon-package" /></span>
                    <span className="pcoded-mtext">Products</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/productsizes" className={getLinkClass}>
                    <span className="pcoded-micon"><i className="feather icon-package" /></span>
                    <span className="pcoded-mtext">Sizes</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/paymenttypes" className={getLinkClass}>
                    <span className="pcoded-micon"><i className="feather icon-credit-card" /></span>
                    <span className="pcoded-mtext">Payment Types</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/suppliers" className={getLinkClass}>
                    <span className="pcoded-micon"><i className="feather icon-layers" /></span>
                    <span className="pcoded-mtext">Suppliers</span>
                  </NavLink>
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
