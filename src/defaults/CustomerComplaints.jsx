import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerComplaints() {
   
     const [customerComplaints, setcustomerComplaints] = useState('');
     const [filteredComplaints, setfilteredComplaints] = useState([]);

     

    useEffect(() => {
      fetchComplaints();
      }, []);
    
       
     const  fetchComplaints = async () =>(
       await axiosInstance.get('/customercomplaints')
       .then(res=>setcustomerComplaints(res.data))
       .catch((err)=>console.log(err))
     )

     

  return (
    <div>Tubas</div>
  );
}

export default CustomerComplaints