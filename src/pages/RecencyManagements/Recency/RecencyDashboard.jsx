import { useSelector } from 'react-redux'

// import components
import RecencyDashboardTableView from '../../../components/recencyManagements/RecencyDashboard/RecencyDashboardTableView'

const RecencyDashboard = () => {
	const { routePermissions } = useSelector((state) => state.auth)
	const { path, key } = routePermissions

	return (
		<section className={'p-4 space-y-4 mt-1'}>
			{path === key && <RecencyDashboardTableView />}
		</section>
	)
}

export default RecencyDashboard
