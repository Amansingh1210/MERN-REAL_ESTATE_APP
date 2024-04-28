import React, { useEffect, useState } from 'react'

function Contact(props) {
    const {listing} = props ;
    const [landlord , setLandloard] = useState(null);
    const [message , setMessage] = useState('');
    const [landlordError , setLandloardError] = useState(false);

    const onChange = (e)=>{
        setMessage(e.target.value);
    }
    
    useEffect(()=>{
        const fetchlandlord = async ()=>{
            try {
                setLandloardError(false)
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                setLandloard(data);
                setLandloardError(true)
            } catch (error) {
                setLandloardError(true)
            }
        }
        fetchlandlord();
    },[listing.userRef])
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea name="message" id="message"  rows="2" value={message} onChange={onChange} placeholder='Enter your message here ...'
          className='w-full border p-3 rounded-lg'></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact