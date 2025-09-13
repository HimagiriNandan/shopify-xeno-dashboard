import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/slices/authSlice.js';

export const useAuthInit = async () => {
  const dispatch = useDispatch();
  try{
    const res = await axios.get('http://localhost:8000/api/auth/userdetails', { withCredentials: true });
    if(res.status === 200){
      dispatch(setUserDetails(res.data));
    }
  }catch(err){
    console.log(err.message);
  }
}