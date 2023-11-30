import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

// import components
import { Avatar, Popover, Button } from 'antd'

// import icons
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'

// import actions
import { setIsAuthenticated, setErrorMsg } from '../services/reducers/authReducer'
import cookies from '../services/actions/authHelpers/cookies'

function UserProfileNavbar() {
	return (
		<div>
			<Popover
				placement={'bottomRight'}
				trigger={'click'}
				content={<UserProfileContainer />}
				overlayInnerStyle={{
					padding: 0,
				}}
			>
				<Avatar
					style={{
						color: 'black',
                        cursor: 'pointer'
					}}
					icon={<UserOutlined />}
				/>
			</Popover>
		</div>
	)
}

const UserProfileContainer = () => {
	const [isLogoutLoading, setIsLogoutLoading] = useState(false)

	const { user } = useSelector((state) => state.auth)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	// handle logout
	const _handleLogout = () => {
		// set logout loading to true
		setIsLogoutLoading(true)

        // clear cookies storage
        cookies.deleteAllCookies()
        
        // set is authentication to false
        dispatch(setIsAuthenticated(false))
        
        //remove error message
        dispatch(setErrorMsg(''))
        
        // redirect to login page
        navigate('/login')
        
        // set logout loading to false
        setIsLogoutLoading(false)
	}

	return (
		<div className={'grid grid-cols-1 w-[220px]'}>
			<div
				className={
					'text-[14px] font-medium pb-2 border-solid border-0 border-b border-slate-200 px-4 py-2 pt-3'
				}
			>
				{user?.username}
			</div>

			<div className={'px-2'}>
				<Link
					to={'/'}
					style={{ color: 'inherit', textDecoration: 'none' }}
					className='hover:text-inherit'
				>
					<div className={'px-2 py-2 hover:bg-[#f9fafb] hover:cursor-pointer rounded'}>
						{'Home'}
					</div>
				</Link>
			</div>
			<div className={'px-2'}>
				<div className={'px-2 py-2 hover:bg-[#f9fafb] hover:cursor-pointer rounded'}>
					{'Profile'}
				</div>
			</div>
			<div className={'px-2'}>
				<div className={'px-2 py-2 hover:bg-[#f9fafb] hover:cursor-pointer rounded'}>
					{'Settings'}
				</div>
			</div>
			<div
				className={
					'px-4 py-2 pb-3 flex justify-end border-solid border-0 border-t border-slate-200'
				}
			>
				<Button
					type={'default'}
					icon={<LogoutOutlined />}
					onClick={_handleLogout}
					danger
					loading={isLogoutLoading}
				>
					{'Logout'}
				</Button>
			</div>
		</div>
	)
}

export default UserProfileNavbar
