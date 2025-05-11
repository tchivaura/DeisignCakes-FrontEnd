import React from 'react'

function CreateUser() {
  return (
    <>
  {/* [ Pre-loader ] start */}
  <div className="loader-bg">
    <div className="loader-track">
      <div className="loader-fill" />
    </div>
  </div>
  {/* [ Pre-loader ] End */}
  {/* [ navigation menu ] start */}
  
  {/* [ navigation menu ] end */}
  {/* [ Header ] start */}
  
  {/* [ Header ] end */}
  {/* [ Main Content ] start */}
  <div className="pcoded-main-container">
    <div className="pcoded-wrapper">
      <div className="pcoded-content">
        <div className="pcoded-inner-content">
          <div className="main-body">
            <div className="page-wrapper">
              {/* [ breadcrumb ] start */}
              <div className="page-header">
                <div className="page-block">
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <div className="page-header-title">
                        <h5 className="m-b-10">User Creation</h5>
                      </div>
                      <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href="index.html">
                            <i className="feather icon-home" />
                          </a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="#!">Admin</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="#!">Create User</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* [ breadcrumb ] end */}
              {/* [ Main Content ] start */}
              <div className="row">
                {/* [ form-element ] start */}
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Basic Information</h5>
                    </div>
                    <div className="card-body">
                    <form >
                      <div className="row">
                        <div className="col-md-6">
                          
                            <div className="form-group">
                              <label htmlFor="exampleInputEmail1">
                                Name 
                              </label>
                              <div className="col-sm-8">
                              <input
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter Name"
                              />
                              </div>
                              
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleFormControlTextarea1">
                                Address
                              </label>
                              <div className="col-sm-8">
                              <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={1}
                                defaultValue={""}
                              />
                              </div>
                            </div>
                            
                            <div className="form-group">
                              <label>UserName</label>
                              <div className="col-sm-8">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Text"
                              />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleFormControlSelect1">
                                Gender
                              </label>
                              <div className="col-sm-8">
                              <select
                                className="form-control"
                                id="exampleFormControlSelect1"
                              >
                                <option>Male</option>
                                <option>Female</option>
                               
                              </select>
                              </div>
                              </div>
                           
                          
                        </div>
                        <div className="col-md-6">
                          
                            <div className="form-group">
                              <label>Surname</label>
                              <div className="col-sm-8">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Text"
                              />
                              </div>
                            </div>
                            <div className="form-group">
                              <label>Date of Birth</label>
                              <div className="col-sm-8">
                              <input
                                type="date"
                                className="form-control"
                                placeholder="Text"
                              />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleInputPassword1">
                                Password
                              </label>
                              <div className="col-sm-8">
                              <input
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                placeholder="Password"
                              />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="exampleFormControlSelect1">
                                Roles
                              </label>
                              <div className="col-sm-8">
                              <select
                                className="form-control"
                                id="exampleFormControlSelect1"
                              >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                              </select>
                              </div>
                            </div>
                            
                          
                        </div>
                        
                        
                        <div className="btn-submit">
                        <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                        </div>
                        
                      </div>
                      </form>
                      
                     
                      
                      
                    </div>
                  </div>
                  {/* Input group */}
                  
                </div>
                {/* [ form-element ] end */}
                {/* [ Main Content ] end */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  )
}

export default CreateUser