import React , {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Components/OAuth'

function Signup() {
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.id]: e.target.value})
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            setLoading(true)
            const response = await fetch('/api/auth/signup',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
            if(data.success === false){
                setError(data.message)
                setLoading(false)
                return 
            }
            setLoading(false)
            setError(null)
            navigate('/signin')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="text" placeholder='username' onChange={handleChange} className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' onChange={handleChange} className='border p-3 rounded-lg' id='email' />
        <input type="password" placeholder='password' onChange={handleChange} className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 '>{loading ? 'Loading...' : 'Sign up'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
          <Link to={'/signin'}>
            <span className='text-blue-700'>Sign in</span>
          </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signup