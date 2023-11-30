// import components
import FlightTableView from '../../../components/flightManagements/FlightInfo/FlightTableView'
import FlightForm from '../../../components/flightManagements/FlightInfo/FlightForm'
import FlightDashboard from '../../../components/flightManagements/FlightInfo/FlightDashboard'

// import actions
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const FlightInfo = () => (
	<>
		{/* <FlightDashboard /> */}
		<PageHeaderBlock
			Title={['Flight Info']}
			TableView={FlightTableView}
			AddEditForm={FlightForm}
		/>
	</>
)

export default FlightInfo
