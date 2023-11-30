// import components
import AirportTableView from '../../../components/flightManagements/Airport/AirportTableView'
import AirportForm from '../../../components/flightManagements/Airport/AirportForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Airport = () => (
    <PageHeaderBlock 
        Title={['Airport List']} 
        TableView={AirportTableView} 
        AddEditForm={AirportForm} 
    />
)

export default Airport