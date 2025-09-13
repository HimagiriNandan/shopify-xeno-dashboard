import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../../store/slices/authSlice.js'
import axios from 'axios'

import './index.css';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const RegisterUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await axios.post('https://shopify-xeno-dashboard.onrender.com/api/auth/login', {
        email,
        password
      }, { withCredentials: true });

      if(res.status === 200){
        toast.success('Logged in successfully');
        setEmail('');
        setPassword('');
        dispatch(setUserDetails(res.data.data));
        navigate('/dashboard')
      }
    } catch(err){
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const validateEmail = (email) => { 
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (re.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const validateData = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast.error('Please fill all the fields');
      return;
    }
    if(validateEmail(email)){
      RegisterUser(e);
    } else{
      toast.error('Please enter a valid email');
    }
  }

  return (
     <>
      <div className='main-container'>
        <div className='card-container'>
          <form onSubmit={(e) => validateData(e)}>
            <h2 className="main-heading">Welcome Back!!!</h2>
            <div className="input-group">
              <label htmlFor="email" className='label-text'>Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input-text'/>
            </div>
            <div className="input-group">
              <label htmlFor="password" className='label-text'>Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='input-text'/>
            </div>
            <button type="submit" className="submit-button" >{!loading ? "Login" : "Logging In..."}</button>
            <p className="redirect-text">
              Don't have an account? <Link to="/signup" className='link-text'>Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
