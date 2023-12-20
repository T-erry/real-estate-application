import { doc, getDoc } from "firebase/firestore";
import Spinner from "../components/Spinner";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaBed, FaBath } from "react-icons/fa6";
import { FaParking,  FaChair } from "react-icons/fa";


import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
} from "swiper";
import "swiper/css/bundle"; // Make sure to import Swiper styles
import { FaShare } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoding] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination, EffectFade]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoding(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied === true && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className=" w-full h-[200px] lg-[400px] ">
          <p className="text-2xl font-semibold mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listing.type === 'rent' ? "/ month" : "" }
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaLocationDot className="text-green-700 mr-1" /> 
          {listing.address}</p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
              <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">{listing.type === "rent" ? "Rent": "Sale"}</p>
              {listing.offer && (
                <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">${listing.regularPrice - listing.discountedPrice} discount</p>
              )}
          </div>
          <p className="mt-3 mb-3">
             <span className="font-semibold">Description - </span>
          {listing.description}
          </p>
          <ul className="flex items-cente space-x-2 sm:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap">
            <FaBed className="text-lg mr-1 " />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed" }
            </li>
            <li className="flex items-center whitespace-nowrap">
            <FaBath  className="text-lg mr-1 " />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath" }
            </li>
            <li className="flex items-center whitespace-nowrap">
            <FaParking  className="text-lg mr-1 " />
              {listing.parking ? "Parking spot" : "No Parking"  }
            </li>
            <li className="flex items-center whitespace-nowrap">
            <FaChair  className="text-lg mr-1 " />
              {listing.furnished ? "Furnished" : "Not furnished"  }
            </li>
          </ul>
          
        </div>
        <div className="bg-blue-300 w-full h-[200px] lg-[400px] z-10 overflow-hidden "></div>
      </div>
    </main>
  );
}
