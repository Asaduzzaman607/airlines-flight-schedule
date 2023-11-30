// import components
import DropAssignmentTableView from '../../../components/vehicleManagements/DropAssignment/DropAssignmentTableView'
import DropAssignmentForm from '../../../components/vehicleManagements/DropAssignment/DropAssignmentForm'

// import actions
import { PageHeaderBlock } from '../../../components/commonComponents'

const DropAssignment = () =>  (
    <PageHeaderBlock 
        Title={['Drop Assignment']} 
        TableView={DropAssignmentTableView} 
        AddEditForm={DropAssignmentForm} 
    />
  )

export default DropAssignment