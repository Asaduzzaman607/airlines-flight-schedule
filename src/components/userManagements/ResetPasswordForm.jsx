import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// import components
import { CustomInputPassword } from '../commonComponents/CustomFormField'
import { Button, Form } from 'antd'

// import actions
import { passwordValidation } from '../../services/actions/commonActions'
import { ResetPassword } from '../../services/actions/UserManagementActions/userAction'

//import icons
import usb_logo from '../../assets/images/usb-logo.png'
import login_bg from '../../assets/images/login-bg.png'
import login_icon from '../../assets/icon/login-icon.png'
import { SlLock } from 'react-icons/sl'

const ResetPasswordForm = () => {
	const { user } = useSelector((state) => state.auth)

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	// save or submit handler
	const onFinish = (values) => {
		const reqPlayload = {
			...values,
			userName: user?.username,
		}
		dispatch(ResetPassword(reqPlayload))
	}

	// reset form data
	const _onReset = () => {
		form.resetFields()
	}
	return (
		<>
			{!user?.isPassReset && !user?.token && <Navigate to={'/'} />}
			{!user?.isPassReset && user?.token && <Navigate to={'/'} />}
			{user?.isPassReset && !user?.token && (
				<div className={'h-screen w-full flex items-center justify-center'}>
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
								<p className='text-2xl mb-6 text-center'>Reset Your Password</p>
								<Form
									name='reset'
									style={{
										width: '100%',
									}}
									onFinish={onFinish}
									autoComplete='off'
								>
									<Label labelName={'Current Password'} />
									<Form.Item
										name='oldPass'
										rules={[
											{
												required: true,
												message: 'Current password is required.',
											},
										]}
									>
										<CustomInputPassword
											type={'text'}
											placeholder={'Enter current password'}
											className='py-2 px-3 text-[#949494]'
										/>
									</Form.Item>
									<Label labelName={'New Password'} />
									<Form.Item
										name='password'
										rules={[
											{
												required: true,
												validator: (_, value) => passwordValidation(value),
											},
										]}
									>
										<CustomInputPassword
											type={'text'}
											placeholder={'Enter new password'}
											className='py-2 px-3 text-[#949494]'
										/>
									</Form.Item>
									<Label labelName={'Confirm Password'} />
									<Form.Item
										name='confirmPassword'
										rules={[
											{
												required: true,
												validator: (_, value) => passwordValidation(value),
											},
										]}
									>
										<CustomInputPassword
											type={'text'}
											placeholder={'Enter confirm password'}
											className='py-2 px-3 text-[#949494]'
										/>
									</Form.Item>

									<Form.Item>
										<Button
											type='primary'
											htmlType='submit'
											className={'bg-[#00488e] mt-4'}
										>
											Submit
										</Button>
										<Button
											htmlType={'reset'}
											onClick={() => _onReset}
											className={'ml-2'}
										>
											{'Reset'}
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

const Label = ({ labelName }) => (
	<div className='flex items-center pl-0.5'>
		<SlLock style={{ fontSize: '13px', fontWeight: 'bold' }} />
		<div className='text-[#626262] text-[16px] font-semibold ml-1'>{labelName ?? ''}</div>
	</div>
)
export default ResetPasswordForm
