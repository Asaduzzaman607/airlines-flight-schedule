import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// import components
import { CustomInput } from '../commonComponents/CustomFormField'
import { Button, Form } from 'antd'

//import icos
import usb_logo from '../../assets/images/usb-logo.png'
import login_bg from '../../assets/images/login-bg.png'
import login_icon from '../../assets/icon/login-icon.png'
import { FaRegUser } from 'react-icons/fa'
import { MdOutlineMail } from 'react-icons/md'

// import actions
import { ResetPassRequested } from '../../services/actions/UserManagementActions/userAction'

const UserInfoResetPassForm = () => {
	const { isResetPassword } = useSelector((state) => state.user)

	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	// save or submit handler
	const onFinish = (values) => {
		dispatch(ResetPassRequested(values))
	}

	// reset form data
	const _onReset = () => {
		form.resetFields()
	}

	useEffect(() => {
		if (isResetPassword) navigate('/login')
	}, [isResetPassword])

	return (
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
						<p className='text-2xl mb-6 text-center'>User Info for Reset Password</p>
						<div className='flex justify-center'>
							<Form
								name='reset'
								layout={'vertical'}
								size={'middle'}
								onFinish={onFinish}
								autoComplete='off'
								validateTrigger={'onChange'}
								style={{ width: '100%' }}
							>
								<div className='flex items-center pl-0.5'>
									<FaRegUser style={{ fontSize: '13px' }} />
									<div className='text-[#626262] text-[16px] font-semibold ml-1'>
										User Name <span className='text-red-600'>*</span>
									</div>
								</div>
								<Form.Item
									name='username'
									rules={[
										{
											type: 'text',
											message: 'The input is not valid',
										},
										{
											required: true,
											validator: async (_, names) => {
												if (!names || names?.includes(' ')) {
													return Promise.reject(
														new Error(
															`${
																!names
																	? 'User name is required.'
																	: names?.includes(' ') &&
																	  'No spaces allowed.'
															}`
														)
													)
												}
											},
										},
									]}
								>
									<CustomInput
										className='py-2 px-3 text-[#949494]'
										type={'text'}
										placeholder={'Enter username'}
									/>
								</Form.Item>
								<div className='flex items-center pl-0.5 mt-2'>
									<MdOutlineMail style={{ fontSize: '13px' }} />
									<div className='text-[#626262] text-[16px] font-semibold ml-1'>
										Email <span className='text-red-600'>*</span>
									</div>
								</div>
								<Form.Item
									name='email'
									rules={[
										{
											type: 'email',
											message: 'The input is not valid',
										},
										{
											required: true,
											message: 'Please enter email.',
										},
										{
											validator: (_, value) =>
												!value.includes(' ')
													? Promise.resolve()
													: Promise.reject(
															new Error('No spaces allowed')
													  ),
										},
									]}
								>
									<CustomInput
										className='py-2 px-3 text-[#949494]'
										type={'email'}
										placeholder={'Enter email'}
									/>
								</Form.Item>

								<Form.Item noStyle>
									<Button
										type='primary'
										htmlType='submit'
										className={'bg-[#00488e] mt-4'}
									>
										Reset
									</Button>
									<Button
										htmlType={'reset'}
										onClick={() => navigate('/login')}
										className={'ml-2'}
									>
										Cancel
									</Button>
								</Form.Item>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserInfoResetPassForm
