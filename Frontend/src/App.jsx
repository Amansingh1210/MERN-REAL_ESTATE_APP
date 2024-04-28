import React from 'react'
import {BrowserRouter , Routes ,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Signin from './Pages/Signin'
import Profile from './Pages/Profile'
import About from './Pages/About'
import Header from './Components/Header'
import Signup from './Pages/Signup'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import EditListing from './Pages/EditListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<EditListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
