// import components
import AircraftTableView from '../../../components/flightManagements/Aircraft/AircraftTableView'
import AircraftForm from '../../../components/flightManagements/Aircraft/AircraftForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Aircraft = () => <PageHeaderBlock Title={['Aircraft List']} TableView={AircraftTableView} AddEditForm={AircraftForm} />

export default Aircraft