import { IoLogOut } from "react-icons/io5";
import { clearUserDetails } from "../../store/slices/authSlice"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import './index.css'

const Sidebar = ({ tab, setTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      const res = await axios.post('https://shopify-xeno-dashboard.onrender.com/api/auth/logout', { withCredentials: true });
      if(res.status === 200){
        dispatch(clearUserDetails());
        navigate('/login');
        toast.success("Logged out successfully!");
      } 
    } catch(err){
      toast.error("Error logging out. Please try again.")
    }
  }

  return (
    <div className='main-sidebar-container'>
      <h1 className="dashboard-greeting">Welcome to Dashboard!!!</h1>
      <div className='sidebar-links-container'>
        <p className={tab === 'Products' ? 'side-item-active' : 'side-item'} onClick={() => setTab('Products')}>Products</p>
        <p className={tab === 'Customers' ? 'side-item-active' : 'side-item'} onClick={() => setTab('Customers')}>Customers</p>
        <p className={tab === 'Orders' ? 'side-item-active' : 'side-item'} onClick={() => setTab('Orders')}>Orders</p>
        <p className={tab === 'Top' ? 'side-item-active' : 'side-item'} onClick={() => setTab('Top')}>Top 5 Customers</p>
      </div>
      <div className="logout-container" onClick={handleLogout}>
        <p >Logout </p>
        <IoLogOut style={{color: "#FFFFFF"}} />
      </div>
    </div>
  )
}

export default Sidebar
