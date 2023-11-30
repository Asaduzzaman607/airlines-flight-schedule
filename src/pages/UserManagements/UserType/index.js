// import components
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'
import { UserTypeForm, UserTypeTableView } from '../../../components/userManagements'

const UserType = () => <PageHeaderBlock Title={['User Type List']} TableView={UserTypeTableView} AddEditForm={UserTypeForm} />

export default UserType