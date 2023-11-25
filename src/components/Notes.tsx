import ContinerSkelliton from "./ContinerSkelliton";
import NotePad from "./NotePad";
import {useEffect} from "react"
import { Link, useParams } from "react-router-dom";
import {useState} from "react"
const ipcRenderer = (window as any).ipcRenderer


export default function Notes() {
  const {id}= useParams()
  const [value, setValue] = useState('');

  

  useEffect(() => {
    const email=JSON.parse(localStorage.getItem("userData") as string).email
    ipcRenderer.send("get:eventData",{email,eventId:id})    

    const responseHandler = (_event: any, response: any) => {
      if (response.error) {
        console.error('Error in get:eventData:response', response.error);
        // Handle the error as needed
      } else {
        console.log(response);
        // Process the response data
        setValue(response.data)
      }
    };

    ipcRenderer.on('get:eventData:response', responseHandler);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      ipcRenderer.off('get:eventData:response', responseHandler);
    };
  }, [])

const handleSubmit = ()=>{
  console.log(value)
  let email=JSON.parse(localStorage.getItem("userData") as string).email
  ipcRenderer.send("store:eventData",{email,eventId:id,summary:value})    

}
  return (
    <ContinerSkelliton>
      <>
      <span> <Link to="/home">
     <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</Link></span>
      <div className="rounded-xl overflow-auto  w-full mx-10 h-[90vh] bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
        <div>
          <NotePad value={value} setValue={setValue}/>
          <button onClick={handleSubmit} className="mt-5 text-white border-white border px-2 py-1 ">Save</button>
        </div>
      </div>
      </>
    </ContinerSkelliton>
  );
}
