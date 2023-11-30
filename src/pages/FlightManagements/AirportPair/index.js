// import components
import AirportPairTableView from '../../../components/flightManagements/AirportPair/AirportPairTableView'
import AirportPairForm from '../../../components/flightManagements/AirportPair/AirportPairForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const AirportPair = () => (
    <PageHeaderBlock 
        Title={['Airport Pair List']} 
        TableView={AirportPairTableView} 
        AddEditForm={AirportPairForm} 
    />
)

export default AirportPair