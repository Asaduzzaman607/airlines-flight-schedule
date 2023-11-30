// import components
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'
import {
	FlightScheduleTableView,
	AddFlightToSeason,
} from '../../../components/flightManagements/FlightSchedule'

const FlightSchedule = () => (
	<PageHeaderBlock
		Title={['Flight Schedule']}
		TableView={FlightScheduleTableView}
		AddEditForm={AddFlightToSeason}
	/>
)

export default FlightSchedule
