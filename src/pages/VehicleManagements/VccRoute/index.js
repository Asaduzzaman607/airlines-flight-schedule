// import components
import TableView from '../../../components/vehicleManagements/Route/TableView'
import AddEditForm from '../../../components/vehicleManagements/Route/AddEditForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const VccRoute = () => {
  
  return (
    <PageHeaderBlock Title={['Route List']} TableView={TableView} AddEditForm={AddEditForm} />
  )
}

export default VccRoute