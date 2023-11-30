import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'

// import components
import { Form, Input, Button, Typography } from 'antd'
import { Spinner } from '../components/layout'

// import icons
import { UserOutlined, LockOutlined } from '@ant-design/icons'

// import actions and reducers
import { userLogin } from '../services/actions/authAction'
import { setIsResetPassword } from '../services/reducers/UserManagementReduers/userReducer'

const { Item } = Form

const Login = () => {
	// token from local storage
	const token = localStorage.getItem('token')
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
		dispatch(userLogin(values))
	}

	useEffect(() => {
		dispatch(setIsResetPassword(false))
	}, [])

	return (
		<>
			{token === 'null' && user?.isPassReset && <Navigate to={'/reset-password'} />}
			{token !== 'null' && isAuthenticated && <Navigate to={'/'} />}
			{token !== 'null' && !isAuthenticated && isAuthValidating && (
				<div className={'h-screen flex justify-center items-center'}>
					<Spinner />
				</div>
			)}
			{token !== 'null' && !isAuthenticated && !isAuthValidating && (
				<div className={'h-screen w-full flex items-center justify-center'}>
					<div className={'border rounded shadow-lg bg-blue-100/10'}>
						<h1
							className={
								'font-semibold text-5xl bg-blue-50 px-10 py-4 shadow text-gray-600 text-center'
							}
						>
							{'Login'}
						</h1>
						<Form
							layout={'vertical'}
							size={'middle'}
							autoComplete={'off'}
							validateTrigger={'onChange'}
							style={{ padding: '4px 30px', textAlign: 'left' }}
							onFinish={_onSubmit}
						>
							<Item
								label={'Username'}
								name={'username'}
								validateStatus={
									isLoading ? 'validating' : errorMsg ? 'error' : 'success'
								}
								rules={[
									{
										required: true,
										message: 'Please enter your username',
									},
								]}
							>
								<Input
									placeholder={'Enter user name'}
									style={{ borderLeft: '4px solid #1890ff' }}
									size={'large'}
									prefix={<UserOutlined style={{ color: '#1890ff' }} />}
								/>
							</Item>
							<Item
								label={'Password'}
								name={'password'}
								validateStatus={
									isLoading ? 'validating' : errorMsg ? 'error' : 'success'
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
									style={{ borderLeft: '4px solid #1890ff' }}
									size={'large'}
									prefix={<LockOutlined style={{ color: '#1890ff' }} />}
								/>
							</Item>
							<Typography style={{ color: 'red', marginBottom: '10px' }}>
								{errorMsg}
							</Typography>
							<Typography style={{ color: 'red', marginBottom: '10px' }}>
								{space ? spaceMsg : ''}
							</Typography>
							<Item>
								<Link className={'login-form-forgot'} to='/user-info'>
									Forget password
								</Link>
							</Item>
							<Item>
								<Button
									type={'primary'}
									htmlType={'submit'}
									style={{ width: '100%' }}
									size={'large'}
									loading={isLoading}
								>
									{'Login'}
								</Button>
							</Item>
						</Form>
					</div>
				</div>
			)}
		</>
	)
}

export default Login
