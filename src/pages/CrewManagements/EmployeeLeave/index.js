// import components
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'
import EmployeeLeaveTableView from '../../../components/crewManagements/EmployeeLeave/EmployeeLeaveTableView'
import EmployeeLeaveForm from '../../../components/crewManagements/EmployeeLeave/EmployeeLeaveForm'

const EmployeeLeave = () => (
    <PageHeaderBlock Title={['Employee Leave']} TableView={EmployeeLeaveTableView} AddEditForm={EmployeeLeaveForm} />
)

export default EmployeeLeave