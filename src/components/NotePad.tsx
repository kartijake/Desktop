import ReactQuill from 'react-quill';
import {Dispatch,SetStateAction} from "react"


interface NotePadProps{
    value:string,
    setValue:Dispatch<SetStateAction<string>>;
}
export default function NotePad({value,setValue}:NotePadProps) {
   
 

    return <ReactQuill className='text-white h-full'  theme="snow" value={value} onChange={setValue} />;
 
}
