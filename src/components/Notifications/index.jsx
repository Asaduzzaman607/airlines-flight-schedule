import { NotificationCenter } from './NotificationCenter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
    // continue...
	// const addNotification = () => {
	// 	// use a random type of notification
	// 	toast(
    //         <a href={'/'} target={'_blank'} className={'text-black hover:text-blue-500'}>
    //             {sliceTextWithEllipsis('Lorem ipsum dolor sit amet sdfd sdfd sdfds sdfasdfs sdfsdf sdf', 45)}
    //         </a>, 
    //         {
    //             type: types[Math.floor(Math.random() * types.length)],
    //         }
    //     )
	// }

	return (
		<div className='flex pr-4 h-min'>
			{/* <button onClick={addNotification}>Add notificaiton</button> */}
			<NotificationCenter />
			<ToastContainer position='bottom-left' newestOnTop style={{minWidth: 'max-content'}}/>
		</div>
	)
}
