// import components
import DriverTableView from '../../../components/vehicleManagements/Driver/DriverTableView'
import DriverForm from '../../../components/vehicleManagements/Driver/DriverForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const Driver = () => {

  return (
    <PageHeaderBlock Title={['Driver List']} TableView={DriverTableView} AddEditForm={DriverForm} />
  )
}

export default Driver