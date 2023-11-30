import { useSelector } from 'react-redux'
import { Outlet, Link } from 'react-router-dom'

// import components
import { Result, Button } from 'antd'

const ProtectedComponent = ({ rootComponent, disableRootComponent }) => {
	const { routePermissions } = useSelector((state) => state.auth)
	const { has_permission, is_exact_path, key, path } = routePermissions

	if (!has_permission)
		return (
			<Result
				status={'403'}
				title={'403'}
				subTitle={'Sorry, you are not authorized to access this page.'}
				extra={<BackToHome />}
			/>
		)
	return (
		<div>
			{(is_exact_path || key !== path || !disableRootComponent) && rootComponent}
			<Outlet />
		</div>
	)
}

const BackToHome = () => (
	<Link to={'/'}>
		<Button type='primary'>Back Home</Button>
	</Link>
)

export default ProtectedComponent
