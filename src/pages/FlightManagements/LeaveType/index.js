// import components
import LeaveTypeTableView from '../../../components/flightManagements/LeaveType/LeaveTypeTableView'
import LeaveTypeForm from '../../../components/flightManagements/LeaveType/LeaveTypeForm'
import {PageHeaderBlock} from '../../../components/commonComponents'

const Driver = () => {

  return (
    <PageHeaderBlock Title={['Leave Type List']} TableView={LeaveTypeTableView} AddEditForm={LeaveTypeForm} />
  )
}

export default Driver