// import components
import TableView from '../../../components/roleManagements/UserRoleDetails/TableView'
import PageHeaderOnlyTitle from '../../../components/commonComponents/PageHeaderOnlyTitle'

const UserRoleDetails= () => {

  return (
    <PageHeaderOnlyTitle title="Role Based User List" Component={TableView} />
  )
}

export default UserRoleDetails