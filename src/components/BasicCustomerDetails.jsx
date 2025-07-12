import React, { useEffect } from 'react';
import CustomerOrders from './CustomerOrders';
import { toast } from 'react-toastify';

function BasicCustomerDetails({ customer }) {

  useEffect(()=>{
  if(customer.label==="Bad")
  {
    toast.warn("⚠️ This customer is labeled as bad");
  }

},[customer.label]

)
 
  return (
    <>
    
    <div className="card">
      <div className="card-header"><h5>Basic Customer Details</h5></div>
      <div className="card-body">
        <form>
          <div className="row mb-3">
           
              <div className="col-md-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={customer?.firstName || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={customer?.addresss || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Telephone</label>
                <input
                  type="text"
                  className="form-control"
                  name="telephone"
                  value={customer?.telephone || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Gender</label>
                <input
                  type="text"
                  className="form-control"
                  name="gender"
                  value={customer?.gender || ''}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Surname</label>
                <input
                  type="text"
                  className="form-control"
                  name="surname"
                  value={customer?.surname || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={customer?.dob || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Base</label>
                <input
                  type="text"
                  className="form-control"
                  name="base"
                  value={customer?.base || ''}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Label</label>
                <input
                  type="text"
                  className="form-control"
                  name="label"
                  style={
                    {"font-weight" :"bold",
                      "color":customer?.label === 'Bad' ? 'red' : 'black'
                      
                    }
                  }
                  value={customer?.label || ''}
                  readOnly
                />
              </div>
              </div>
           
        </form>
      </div>
    </div>
    <CustomerOrders  customer={customer} />
    </>

  );
}

export default BasicCustomerDetails;
