import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';

function Profile() {
  const {currentUser} =useSelector((state)=> state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileperc, setfileperc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  
  // console.log(formData);
  // console.log(file);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload =(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
   (snapshot)=>{
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100 ;
    setfileperc(Math.round(progress))
   },
   (error)=>{
    setFileUploadError(true)
   },
   ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setFormData({...formData, avatar: downloadURL})
   })
   }
  );
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>
    <form className='flex flex-col gap-4'>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/'/>
      <img  onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

      {/* Image uploading UI  */}
       <p className='text-sm self-center'>
        {fileUploadError ? 
        (<span className='text-red-700'>Error Image uploading</span>) :
        fileperc > 0 && fileperc < 100 ? 
        (<span className='text-green-700'>{`Uploding ${fileperc} %`}</span>) :
        fileperc === 100 ?  
        (<span className='text-green-700'> Image Uploaded Successfully</span>) : " "
      }
      </p>
      <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
      <input type="text" placeholder='email' className='border p-3 rounded-lg' id='email'/>
      <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password'/>
      <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
    </form>
    <div className='flex justify-between mt-5'>
      <span className="text-red-700 font-semibold cursor-pointer">Delete</span>
      <span className="text-red-700 font-semibold cursor-pointer">Sign out</span>
    </div>
    </div>
  )
}

export default Profile