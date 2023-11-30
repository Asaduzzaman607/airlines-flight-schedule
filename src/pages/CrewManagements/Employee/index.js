// import components
import EmployeeTableView from '../../../components/crewManagements/Employee/EmployeeTableView'
import EmployeeForm from '../../../components/crewManagements/Employee/EmployeeForm'
import { PageHeaderBlock } from '../../../components/commonComponents'

const Employee = () => (
    <PageHeaderBlock 
        Title={['Cockpit Crew List']} 
        TableView={EmployeeTableView} 
        AddEditForm={EmployeeForm} 
    />
)

export default Employee