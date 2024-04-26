import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signInFailure, signOutUserSuccess} from '../redux/user/userSlice.js'

function Profile() {
  const { currentUser , loading , error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileperc, setfileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  // console.log(formData);
  // console.log(file);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfileperc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.id]: e.target.value});
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const respone = await fetch(`/api/user/updateUser/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data  = await respone.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error,message));
    }
  };

  const handleDelete = async (e) =>{
    try {
      dispatch(deleteUserStart());
      const respone = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type' : 'application/json',
        },
      });
      const data  = await respone.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error,message));
    }
  };

  const handleSignOut = async () =>{
    try {
      dispatch(signOutUserStart());
      const response = await fetch('/api/auth/signout');
      const data = response.json();
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          defaultValue="https://lh3.googleusercontent.com/a/ACg8ocLPdKkDGYACmCEIAObgoFPJZ9o4-kRkoSVmQJqVfEofitxiwQ=s96-c"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* Image uploading UI  */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image uploading</span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-green-700">{`Uploding ${fileperc} %`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700"> Image Uploaded Successfully</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          defaultValue={currentUser.password}
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80" button="submit">
          {loading ? 'loading...' : 'update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 font-semibold cursor-pointer">
          Delete
        </span>
        <span onClick={handleSignOut} className="text-red-700 font-semibold cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'user Created successfully' : ''}</p>
    </div>
  );
}

export default Profile;
