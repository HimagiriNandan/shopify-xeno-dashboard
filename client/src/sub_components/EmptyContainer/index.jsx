import './index.css';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import Modal from '../ConnectModel/index.jsx';

function EmptyContainer({ tabOpened }){
  const [modalOpen, setModalOpen] = useState(false);
  const isStoreConnected = useSelector(state => state.data.isConnected);

  return(
    <>
    { modalOpen && <Modal setModalOpen={setModalOpen}/>}
      <div className="empty-container">
        <div className="inner-empty-container">
          <img src="EmptyImage-removebg-preview.png" alt="EmptyContainer" className="image-styling"/>
          { isStoreConnected && <h2 className="heading-text">No {tabOpened} found</h2>}
          { !isStoreConnected &&
            <button className="connect-btn" onClick={() => setModalOpen(true)}>Connect your Shopify store</button>
          }
        </div>
      
      </div>
    </>
  )
}

export default EmptyContainer;

