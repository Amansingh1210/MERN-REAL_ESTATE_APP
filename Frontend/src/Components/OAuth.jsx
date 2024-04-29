import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () =>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);
            const response = await fetch('/api/auth/google',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email ,profilePhoto: result.user.photoURL})
            });
            const data = await response.json();
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }
  return (
    <button onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg uppercase p-3 hover:opacity-95'>continue with google</button>
  )
}

export default OAuth