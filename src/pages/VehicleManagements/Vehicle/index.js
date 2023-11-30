// import components
import VehicleTableView from '../../../components/vehicleManagements/Vehicle/VehicleTableView'
import VehicleForm from '../../../components/vehicleManagements/Vehicle/VehicleForm'
import { PageHeaderBlock } from '../../../components/commonComponents'

const Vehicle = () => (
    <PageHeaderBlock 
        Title={['Vehicle List']} 
        TableView={VehicleTableView} 
        AddEditForm={VehicleForm} 
    />
 ) 


export default Vehicle