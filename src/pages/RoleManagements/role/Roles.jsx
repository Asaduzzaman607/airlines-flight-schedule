// import components
import RoleTableView from '../../../components/roleManagements/Role/RoleTableView'
import RoleForm from '../../../components/roleManagements/Role/RoleForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Roles = () => (
    <PageHeaderBlock 
        Title={['Role List']} 
        TableView={RoleTableView} 
        AddEditForm={RoleForm} 
    />
)

export default Roles