import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'

// import components
import { Form, Input, Button, Typography, Switch } from 'antd'
import { Spinner } from '../components/layout'

// import icons
import login_bg from '../assets/images/login-bg.png'
import login_icon from '../assets/icon/login-icon.png'
import usb_logo from '../assets/images/usb-logo.png'
// import actions and reducers
import { userLogin } from '../services/actions/authAction'
import { setIsResetPassword } from '../services/reducers/UserManagementReduers/userReducer'
import { FaRegUser } from 'react-icons/fa'
import { SlLock } from 'react-icons/sl'
import cookies from '../services/actions/authHelpers/cookies'

const { Item } = Form

const Login = () => {
	// token from local storage
	// const token = localStorage.getItem('token')
	const token = cookies.getCookie('token')
	const [spaceMsg, setSpaceMsg] = useState('')
	const [space, setSpace] = useState(false)

	// redux auth states
	const { isLoading, errorMsg, isAuthenticated, isAuthValidating, user } = useSelector(
		(state) => state.auth
	)

	// dispatch from react-redux
	const dispatch = useDispatch()

	// form on submit
	const _onSubmit = (values) => {
		const regexp = /^\S*$/
		if (!regexp.test(values.username) || !regexp.test(values.password)) {
			// cancel process, whitespace found;
			setSpace(true)
			setSpaceMsg('Space not allowed')
			return
		}

		// dispatch to login action
		dispatch(
			userLogin(
				{ username: values?.username, password: values?.password },
				values?.isRemember
			)
		)
	}

	useEffect(() => {
		dispatch(setIsResetPassword(false))
	}, [dispatch, user?.isPassReset])

	return (
		<>
			{!token && user?.isPassReset && <Navigate to={'/reset-password'} />}
			{token && isAuthenticated && <Navigate to={'/'} />}
			{token && !isAuthenticated && isAuthValidating && (
				<div className={'h-screen flex justify-center items-center'}>
					<Spinner />
				</div>
			)}
			{!token && !isAuthenticated && !isAuthValidating && (
				<div className={'h-screen w-screen  grid justify-items-center content-center'}>
					<div className='fixed top-5 left-5'>
						<img src={usb_logo} className='w-full h-full rounded' alt='' />
					</div>
					<div className='mt-10 pt-8 sm:mt-2 lg:max-w-5xl w-full lg:flex justify-center'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:m-4'>
							<div className='hidden sm:block'>
								<img src={login_bg} className='w-full h-full rounded' alt='' />
							</div>
							<div className='bg-white m-2 sm:m-0 p-5 rounded shadow-lg'>
								<img src={login_icon} alt='' className='block mx-auto mb-4' />
								<p className='text-2xl mb-6 text-center'>Login to Account</p>
								<Form
									layout={'vertical'}
									size={'middle'}
									autoComplete={'off'}
									validateTrigger={'onChange'}
									onFinish={_onSubmit}
								>
									<div className='flex items-center pl-0.5'>
										<FaRegUser style={{ fontSize: '13px' }} />
										<div className='text-[#626262] text-[16px] font-semibold ml-1'>
											User Name
										</div>
									</div>
									<Item
										name={'username'}
										validateStatus={
											isLoading
												? 'validating'
												: errorMsg
												? 'error'
												: 'success'
										}
										rules={[
											{
												required: true,
												message: 'Please enter your username',
											},
										]}
									>
										<Input
											className='py-2 px-3 text-[#949494]'
											placeholder={'Enter user name'}
											size={'large'}
										/>
									</Item>
									<div className='flex items-center pl-0.5'>
										<SlLock style={{ fontSize: '13px', fontWeight: 'bold' }} />
										<div className='text-[#626262] text-[16px] font-semibold ml-1'>
											Password
										</div>
									</div>
									<Item
										name={'password'}
										validateStatus={
											isLoading
												? 'validating'
												: errorMsg
												? 'error'
												: 'success'
										}
										rules={[
											{
												required: true,
												message: 'Please enter your password',
											},
											{
												min: 8,
												message: 'Password must be at least 8 characters',
											},
										]}
									>
										<Input.Password
											placeholder={'Enter password'}
											className='py-2 px-3 text-[#949494]'
										/>
									</Item>
									<Typography style={{ color: 'red', marginBottom: '10px' }}>
										{errorMsg}
									</Typography>
									<Typography style={{ color: 'red', marginBottom: '10px' }}>
										{space ? spaceMsg : ''}
									</Typography>
									<div className='flex justify-center my-2'>
										<div className='w-full lg:w-6/12'>
											<div className='flex items-center pb-2'>
												<Item
													name={'isRemember'}
													valuePropName='checked'
													noStyle
												>
													<Switch size='small' />
												</Item>
												<Typography className='text-sm text-[#949494] ml-2 pt-1 text-[16px]'>
													Remember me
												</Typography>
											</div>
										</div>
										<div className='w-full lg:w-6/12 text-right text-sm pt-1'>
											<Link href='#' target='_blank'>
												<Link
													className='text-sm text-[#00488e] text-[16px] font-semibold'
													to='/user-info'
												>
													Forgot Password?
												</Link>
											</Link>
										</div>
									</div>
									<Item>
										<Button
											type={'primary'}
											htmlType={'submit'}
											style={{ width: '100%' }}
											size={'large'}
											loading={isLoading}
											className='bg-[#00488e] w-full'
										>
											{'Login'}
										</Button>
									</Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Login
