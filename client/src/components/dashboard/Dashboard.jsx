import Navbar from "../../sub_components/Navbar/Navbar.jsx"
import Sidebar from "../../sub_components/Sidebar/index.jsx"
import './Dashboard.css';
import EmptyContainer from "../../sub_components/EmptyContainer/index.jsx";

import { useState } from 'react'
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [tab, setTab] = useState('Products');

  const products = useSelector(state => state.data.products);
  const orders = useSelector(state => state.data.orders);
  const customers = useSelector(state => state.data.customers);

  return (
    <>
      <Navbar />
      <div className="d-main-container">
        <Sidebar tab={tab} setTab={setTab} />
        <EmptyContainer tabOpened={tab} />
      </div>
     
    </>
  )
}

export default Dashboard
