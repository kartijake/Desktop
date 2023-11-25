import { FC } from 'react'
import { Link } from 'react-router-dom'

interface CountryListItems {
    id:number,
    title:string,
    url:string
}
const DestinationCards:FC<CountryListItems>=({id,title,url})=> {
  return (
 <article key={id} className="relative w-full h-64 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl  transition duration-300 ease-in-out" style={{backgroundImage: `url("${url}")`}}>
  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:opacity-75 transition duration-300 ease-in-out" />
  <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex justify-center items-center">
    <h3 className="text-center">
      <Link className="text-white text-2xl font-bold text-center" to={`/destination/${id}`}>
        <span className="absolute inset-0" />
      {title}
      </Link>
    </h3>
  </div>
</article>

  )
}

export default DestinationCards