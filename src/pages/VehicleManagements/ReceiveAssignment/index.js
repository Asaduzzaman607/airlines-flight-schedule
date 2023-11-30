// import components
import ReceiveAssignmentTableView from '../../../components/vehicleManagements/ReceiveAssignment/ReceiveAssignmentTableView'
import ReceiveAssignmentForm from '../../../components/vehicleManagements/ReceiveAssignment/ReceiveAssignmentForm'
import { PageHeaderBlock } from '../../../components/commonComponents'

const ReceiveAssignment = () => (
    <PageHeaderBlock 
      Title={['Receive Assignment']} 
      TableView={ReceiveAssignmentTableView} 
      AddEditForm={ReceiveAssignmentForm} 
    />
)

export default ReceiveAssignment