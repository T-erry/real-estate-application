import { doc, getDoc } from "firebase/firestore";
import Spinner from "../components/Spinner";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
} from "swiper";
import "swiper/css/bundle"; // Make sure to import Swiper styles
import { FaShare } from "react-icons/fa";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoding] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
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
        onClick={()=>{
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(()=>{
            setShareLinkCopied(false);

          }, 2000)
        }}
        >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied === true && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link Copied</p>
      )}
    </main>
  );
}
