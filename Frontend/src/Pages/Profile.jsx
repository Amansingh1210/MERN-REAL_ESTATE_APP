import React, { useEffect } from "react";
import { Link } from 'react-router-dom' ;
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
  const [showListiingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteListingError, setDeleteListingError] = useState(false)
  const [deleteListingStatus, setDeleteListingStatus] = useState(false);


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
  };

  const handleShowListings = async ()=>{
    try {
      setShowListingError(false)
      const respone = await fetch(`/api/user/listings/${currentUser._id}`, {
        method: "GET",
      }); 
      const data = await respone.json();
      console.log(data);
      
      if (data.success === false) {
        setShowListingError(true)
        return;
      }
      setShowListingError(data.message);
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  
  const handleListingDelete = async (listingId)=>{
    try {
      setDeleteListingError(false);
      setDeleteListingStatus(false);
      const respone = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await respone.json();
      if (data.success === false) {
        setDeleteListingError(data.message);
        return;
      }
      setUserListings((prev)=>{
        prev.filter((listing)=> listing._id !== listingId)
      });
      setDeleteListingError(false);
      setDeleteListingStatus(true)
    } catch (error) {
      setDeleteListingError(true);
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
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          button="submit"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDelete}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Delete
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "user updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListiingError ? "Error showing listings" : ""}
      </p>
      <p className="text-green-700 mt-5">
        {deleteListingStatus ? "listing deleted successfully" : ""}
      </p>
      <p className="text-red-700 mt-5">
        {deleteListingError ? "listing not deleted " : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16  object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    handleListingDelete(listing._id);
                  }}
                  className="text-red-700"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
