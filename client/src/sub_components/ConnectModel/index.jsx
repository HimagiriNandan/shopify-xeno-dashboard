import './index.css'
import {useState} from 'react';

import { IoMdCloseCircle } from "react-icons/io";
import { toast } from 'sonner';

const Modal = ({ setModalOpen }) => {

  const [domain, setDomain] = useState('')
  
  const handleConnection = () => {
    if(domain.trim() === ''){
      toast.error('Domain cannot be empty');
      return;
    }
    const pattern = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
    if(!pattern.test(domain)){
      toast.error('Please enter a valid Shopify domain (e.g., example.myshopify.com)');
      return;
    }
    try{
      window.location.href = `https://shopify-xeno-dashboard.onrender.com/api/shopify/connect-shopify?shop=${domain}`;
    }catch(err){
      toast.error('Failed to initiate connection. Please try again.');
    }


  }

  return (
    <div className="connect-modal-container">
      <div className="modal-container">
        <IoMdCloseCircle className='close-icon' onClick={() => setModalOpen(false)}/>
        <h1 className="modal-heading">Connect your Shopify store</h1>
        <label htmlFor="domain" className='label-text'>Enter your shopify domain:</label>
        <input id="domain" type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder='example.myshopify.com' className="input-text" />
        <button className="connect-store-btn" onClick={handleConnection}>Connect</button>
      </div>
    </div>
  )
}

export default Modal
