// import components
import { UserTableView } from '../../../components/userManagements'

import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'
import UserForm from './UserForm'

const User = () => {
  return (
    <PageHeaderBlock Title={['User List']} TableView={UserTableView} AddEditForm={UserForm} />
  )
}

export default User