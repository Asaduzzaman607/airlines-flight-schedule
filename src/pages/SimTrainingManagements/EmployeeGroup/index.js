// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import EmployeeGroupForm from '../../../components/simTrainingManagements/Configurations/EmployeeGroup/EmployeeGroupForm'
import EmployeeGroupTableView from '../../../components/simTrainingManagements/Configurations/EmployeeGroup/EmployeeGroupTableView'

const EmployeeGroup = () => ( 
    <PageHeaderBlock 
        Title={['SIM Group']} 
        TableView={EmployeeGroupTableView} 
        AddEditForm={EmployeeGroupForm} 
    /> 
)

export default EmployeeGroup