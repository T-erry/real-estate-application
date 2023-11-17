import ListingItems from '../components/ListingItems';
import React, {useEffect, useState} from 'react';
// import {
//   collection,
//   // deleteDoc,
//   doc,
//   // getDocs,
//   // orderBy,
//   query,
//   updateDoc,
//   where,
// } from "firebase/firestore";
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, doc, updateDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';




export default function Profile() {
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name, email} = formData;
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

function onLogOut(){
  auth.signOut()
  navigate('/')
}

function handleChange(e){
  setFormData((prevState)=>({
    ...prevState,
    [e.target.id]: e.target.value,

  }))
}
 async function onSubmit(){
  
  try {
    if(auth.currentUser.displayName !== name){
      //Update displayName in Firebase authentication
      await updateProfile(auth.currentUser, {
        displayName: name, 
      } );
      // update the name in the firestore
      
      const docRef = doc(db, "users", auth.currentUser.uid)

      await updateDoc(docRef, {
        name,
      })
    }
    toast.success("Profile details updated")
    
  } catch (error) {
    toast.error("Could not update the profile details")
    
  }
}

useEffect(() => {
  async function fetchUserListings() {
    const listingRef = collection(db, "listings");
    const q = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(q);
    let listings = [];
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings(listings);
    setLoading(false);
  }
  fetchUserListings();
}, [auth.currentUser.uid]);

  return (
    <>
    <section className=' max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
    <div className='w-full md:w-[50%] mt-6 px-3'>
      <form>
        {/* Name Input  */}
        <input type="text" 
        id="name" 
        value={name}
         disabled={!changeDetail}
         onChange={handleChange}
         className={`w-full px-6 mb-6 py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition ease-in-out 
          ${changeDetail &&  'bg-red-200  focus:bg-red-200' }`}/>
        
        {/* Email input */}
        <input type="email" id="email" value={email} disabled className='w-full  px-6  py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition ease-in-out'/>
    
      <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg  mb-6'>
        <p className='flex items-center'>Do you want to change your name? <span
         className='text-red-600 hover:text-red-700 transition duration-150 ease-out ml-1  cursor-pointer' 
         onClick={()=> {
          changeDetail && onSubmit()
          setChangeDetail(prevState=> !prevState)
          }
         }>{changeDetail ? "Apply change" : 'Edit' }</span> </p>
        <p onClick={onLogOut} className='text-blue-600 hover:text-blue-800 cursor-pointer transition duration-200 ease-in-out'>Sign out</p>
      </div>
      </form>
      <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 cursor-pointer transition duration-150ms ease-in-out hover:shadow-lg active:bg-blue-800'>
        <Link to='/create-listing' className='flex justify-center items-center'>
        <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>
      sell or rent your home
        </Link> 
       
      </button>
    </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
    {loading && <p>Loading...</p>}
      {!loading && listings.length > 0 && (
        <>
        <h2 className='text-2xl text-center font-semibold'>My Listings</h2>
        <ul>
          {listings.map((listing)=>{
            return  <ListingItems listing={listing.data} key={listing.id} id={listing.id}/>
          })}
        </ul>
        </>
      ) }
    </div>

    </>
  )
}
