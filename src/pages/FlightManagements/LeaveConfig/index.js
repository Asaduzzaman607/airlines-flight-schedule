// import components
import LeaveConfigTableView from '../../../components/flightManagements/LeaveConfig/LeaveConfigTableView'
import LeaveConfigForm from '../../../components/flightManagements/LeaveConfig/LeaveConfigForm'

// import actions
import { PageHeaderBlock } from '../../../components/commonComponents'

const LeaveConfig = () => (
    <PageHeaderBlock 
        Title={['Leave Configaration']} 
        TableView={LeaveConfigTableView} 
        AddEditForm={LeaveConfigForm} 
    />
)

export default LeaveConfig