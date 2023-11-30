// import components
import FlightSeasonTableView from '../../../components/flightManagements/FlightSeason/FlightSeasonTableView'
import FlightSeasonForm from '../../../components/flightManagements/FlightSeason/FlightSeasonForm'

// import actions
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const FlightSeason = () => (
    <PageHeaderBlock 
        Title={['Flight Seasons']} 
        TableView={FlightSeasonTableView} 
        AddEditForm={FlightSeasonForm} 
    />
)

export default FlightSeason