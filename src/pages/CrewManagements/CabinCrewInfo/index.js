// import components
import EmployeeForm from '../../../components/crewManagements/Employee/EmployeeForm'
import CabinCrewTableView from '../../../components/crewManagements/Employee/CabinCrewTableView'
import { PageHeaderBlock } from '../../../components/commonComponents'

const CabinCrewInfo = () => (
    <PageHeaderBlock 
        Title={['Cabin Crew List']} 
        TableView={CabinCrewTableView} 
        AddEditForm={EmployeeForm} 
    />
)

export default CabinCrewInfo