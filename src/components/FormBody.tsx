import React,{useEffect} from "react"
import Logo from "../assets/icon.png"
import { Link,useNavigate  } from "react-router-dom"
import ContinerSkelliton from "./ContinerSkelliton"
import { useForm,SubmitHandler } from "react-hook-form"
import {toast} from "react-toastify"

interface FormBodyProps{
type:"login" | "sign-up"
}
type FormData = {
  name?: string;
  email: string;
  password: string;
};
 const  FormBody:React.FC<FormBodyProps>=({type})=> {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
const Router= useNavigate ()
  const ipcRenderer= (window as any).ipcRenderer
  const onSubmit:SubmitHandler<FormData> = (data)=>{
    ipcRenderer.send("submit:auth",{...data,type})    
  }
  useEffect(() => {
    const responseHandler = (_event: any, response: any) => {
      if (response.type === 'sign-up') {
        if (response.success) {
          // Handle successful sign-up response
          toast.success('Sign-up successful');
          Router("/")
        } else {
          // Handle sign-up error response
          console.error('Sign-up Error:', response.error);
          toast.error(response.error);
        }
      } else if (response.type === 'login') {
        if (response.success) {
          localStorage.setItem("userData",JSON.stringify(response.userData))
          Router("/home")
        } else {
          // Handle login error response
          console.error('Login Error:', response.error);
          toast.error(response.error);
        }
      } else {
        // Handle unexpected response type
        console.error('Unexpected response type:', response.type);
        toast.error('Unexpected response type');
      }
    };

    ipcRenderer.on('submit:auth:response', responseHandler);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      ipcRenderer.off('submit:auth:response', responseHandler);
    };
  }, [])
  return (
    <ContinerSkelliton>

    <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
      <div className="text-white">
        <div className="mb-8 flex flex-col items-center">
          <img src={Logo} width={50}  />
          <h1 className="mb-2 text-2xl">TravelLog</h1>
          <span className="text-gray-300">Enter Login Details</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
      {type === 'login' && (
        <>
          <div className="mb-4 text-lg">
            <input
              {...register('email', { required: 'Email is required' })}
              className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
              type="text"
              placeholder="id@email.com"
            />
            <div className="text-red-600 text-sm text-center">{errors.email?.message}</div>
          </div>
          <div className="mb-4 text-lg">
            <input
              {...register('password', { required: 'Password is required' })}
              className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
              type="password"
              placeholder="*********"
            />
            <div className="text-red-600 text-sm text-center">{errors.password?.message}</div>
          </div>
        </>
      )}
      {type === 'sign-up' && (
        <>
          <div className="mb-4 text-lg">
            <input
              {...register('name', { required: 'Name is required' })}
              className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
              type="text"
              placeholder="Name"
            />
            <div className="text-red-600 text-sm text-center">{errors.name?.message}</div>
          </div>
          <div className="mb-4 text-lg">
            <input
              {...register('email', { required: 'Email is required' })}
              className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
              type="email"
              placeholder="id@email.com"
            />
            <div className="text-red-600 text-sm text-center">{errors.email?.message}</div>
          </div>
          <div className="mb-4 text-lg">
            <input
              {...register('password', { required: 'Password is required' })}
              className="rounded-3xl border-none bg-yellow-400 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
              type="password"
              placeholder="*********"
            />
            <div className="text-red-600 text-sm text-center">{errors.password?.message}</div>
          </div>
        </>
      )}
      <div className="mt-8 flex justify-center text-lg text-black">
        <button
          type="submit"
          className="rounded-3xl bg-yellow-400 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600"
        >
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </form>
        <span className="text-center w-full inline-block text-sm ">  
            {type == "login" && (
              <Link to="/sign-up">Sign-up?</Link>

            )}
            {type == "sign-up" && (
              <Link to="/">Login?</Link>

            )}
            
            </span>
      </div>
    </div>

  </ContinerSkelliton>
  )
}


export default FormBody