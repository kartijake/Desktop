import ReactDOM from 'react-dom/client'
import './index.css'
import {  RouterProvider, createHashRouter } from 'react-router-dom'
import FormBody from './components/FormBody.tsx'
import 'react-quill/dist/quill.snow.css';
import Destinations from './components/Destinations.tsx'
import Notes from './components/Notes.tsx'
import 'react-toastify/dist/ReactToastify.css';

const router = createHashRouter([
  {
    path: "/",
    element: (
      <>
   <FormBody type='login'/>
      </>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <>
   <FormBody type='sign-up'/>
      </>
    ),
  },
  {
    path: "/home",
    element: (
      <>
   <Destinations/>
      </>
    ),
  },
  {
    path: "/destination/:id",
    element: (
      <>
   <Notes/>
      </>
    ),
  },

])
ReactDOM.createRoot(document.getElementById('root')!).render(
  
       <RouterProvider router={router} />
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
