// import components
import { Space } from 'antd'
import UserProfileNavbar from './UserProfileNavbar'
import Notifications from './Notifications'

const NavbarOptions = () => {
	return (
		<div>
			<Space>
				<Notifications />
				<UserProfileNavbar />
			</Space>
		</div>
	)
}

export default NavbarOptions
