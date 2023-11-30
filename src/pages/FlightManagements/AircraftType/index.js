// import components
import AircraftTypeTableView from '../../../components/flightManagements/AircraftType/AircraftTypeTableView'
import AircraftTypeForm from '../../../components/flightManagements/AircraftType/AircraftTypeForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const AircraftType = () => (
    <PageHeaderBlock 
        Title={['Aircraft Type']} 
        TableView={AircraftTypeTableView} 
        AddEditForm={AircraftTypeForm} 
    />
)

export default AircraftType