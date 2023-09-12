import React, {useState} from 'react'
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const {name, email} = formData;
  const navigate = useNavigate();

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
       
      </form>
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
    </div>
    </section>

    </>
  )
}
