import React, { useEffect, useState } from 'react';
import Birthdays from '../components/Birthdays';
import Orders from '../components/Orders';
import DailyAmount from '../components/DailyAmount';

function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time, e.g., fetching data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader-bg">
          <div className="loader-track">
            <div className="loader-fill" />
          </div>
        </div>
      ) : (
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
                              <h5>Home</h5>
                            </div>
                            <ul className="breadcrumb">
                              <li className="breadcrumb-item">
                                <a href="/">
                                  <i className="feather icon-home" />
                                </a>
                              </li>
                              <li className="breadcrumb-item">
                                <a href="#!">Analytics Dashboard</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* [ breadcrumb ] end */}
                    {/* [ Main Content ] start */}
                    <div className="row">
                      <Orders />
                      <DailyAmount />
                      <Birthdays />
                    </div>
                    {/* [ Main Content ] end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
