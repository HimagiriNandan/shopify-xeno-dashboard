import './Navbar.css'
import { useSelector } from 'react-redux';
const Navbar = () => {
  const username = useSelector((state) => state.auth.username);
  return (
    <div className="nav-main-container">
      <h1 className="logo">Store Sync</h1>
      <h1 className="heading">Dashboard</h1>
      <h1 className='user-name'>Hey, {username}!!!</h1>
    </div>
  )
}

export default Navbar
