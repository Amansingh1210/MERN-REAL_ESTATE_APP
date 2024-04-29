import React , {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../Components/OAuth'

function Signin() {
   const [formData, setFormData] = useState({})
   const {loading , error} = useSelector((state)=> state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]: e.target.value})
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            dispatch(signInStart());
            const response = await fetch('/api/auth/signin',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            // console.log(data);
            if(data.success === false){
                dispatch(signInFailure(data.message))
                return 
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            dispatch(signInFailure(data.message))
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="email" placeholder='email' onChange={handleChange} className='border p-3 rounded-lg' id='email' />
        <input type="password" placeholder='password' onChange={handleChange} className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>{loading ? 'Loading...' : 'Sign in'}</button>
        {/* <OAuth/> */}
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
          <Link to={'/signup'}>
            <span className='text-blue-700'>Sign up</span>
          </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signin