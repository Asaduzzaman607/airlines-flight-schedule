import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

// import components
import { Layout } from 'antd'
import { CustomDrawer, Navbar } from '../components'
import { Spinner } from '../components/layout'
import cookies from '../services/actions/authHelpers/cookies'

const ProtectedRoute = () => {
	// rudux state
	const { isAuthenticated, isAuthValidating } = useSelector((state) => state.auth)

	// local storage token setup
	// const token = localStorage.getItem('token')
	const token = cookies.getCookie('token')

	if (isAuthValidating) {
		return (
			<div className={'h-screen flex justify-center items-center'}>
				<Spinner />
			</div>
		)
	}

	if (isAuthenticated && token && !isAuthValidating) {
		return (
			<Layout>
				<Navbar />
				<Layout>
					<CustomDrawer />
					<Layout.Content>
						<div className={'h-[calc(100%)] bg-blue-50/40'}>
							<Outlet />
						</div>
					</Layout.Content>
				</Layout>
			</Layout>
		)
	}

	if (!isAuthenticated && !token && !isAuthValidating) {
		return <Navigate to={'/login'} />
	}
}

export default ProtectedRoute
