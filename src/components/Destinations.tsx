import { Link } from "react-router-dom";
import ContinerSkelliton from "./ContinerSkelliton";
import DestinationCards from "./DestinationCards";
import {useEffect,useState} from "react"
type CountryLists = {
  id: number;
  title: string;
  url: string;
}[];

const CountryList: CountryLists = [
  {
    title: "Vennis",
    url: "https://plus.unsplash.com/premium_photo-1661962660197-6c2430fb49a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 1,
  },
  {
    title: "Greece",
    url: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 2,
  },
  {
    title: "Paris",
    url: "https://images.unsplash.com/photo-1558660149-07b0d25b2389?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 3,
  },

  {
    title: "Bali",
    url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 4,
  },
  {
    title: "Agra",
    url: "https://images.unsplash.com/photo-1585506942812-e72b29cef752?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 5,
  },
  {
    title: "Pisa",
    url: "https://images.unsplash.com/photo-1581473483413-313a5afffb08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVhbmluZyUyMHRvd2VyfGVufDB8fDB8fHww",
    id: 6,
  },
];


const Destinations = () => {
  const [userData,setUserData]=useState<any>()
  useEffect(()=>{
const user= JSON.parse(localStorage.getItem("userData") as string)
setUserData(user)
  },[])
  return (
    <ContinerSkelliton>
      <>
     <span onClick={()=>{
      localStorage.removeItem("userData")
     }}> <Link to="/">
     <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</Link></span>
      <div className="rounded-xl overflow-auto  w-full mx-10 h-[90vh] bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
          <div className="text-white mb-3">
            Hi, <span className="capitalize">{userData!=undefined?userData.name:""}</span>, start writing your logs
          </div>
        <div className="grid  md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5">
          {CountryList.map((val) => (
            <DestinationCards
              id={val.id}
              key={val.id}
              title={val.title}
              url={val.url}
            />
          ))}
        </div>
      </div>
      </>
    </ContinerSkelliton>
  );
};

export default Destinations;
