import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import Swipercore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

function Listing() {
    Swipercore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        setLoading(true)
      const fetchListing = async ()=>{
        try {
            setLoading(true);
           const response = await fetch(
             `/api/listing/getListing/${params.listingId}`
           );
           const data = await response.json();
           if (data.success === false){
                setError(true);
                setLoading(false);
               return;
           }

           setListing(data); 
           setLoading(false);
           setError(false)
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };
    fetchListing();
    
    }, [params.listingId])
    
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went Worng!</p>}
      {listing && !loading && !error && <>
        <Swiper navigation>
            {listing.imageUrls.map((url)=>(
                <SwiperSlide key={url}>
                    <div className="h-[550px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                </SwiperSlide>
            ))}
        </Swiper>
      
      </>
      }
    </main>
  );
}

export default Listing