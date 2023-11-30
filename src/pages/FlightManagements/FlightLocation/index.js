// import components
import TableView from '../../../components/flightManagements/FlightLocation/TableView';
import AddEditForm from '../../../components/flightManagements/FlightLocation/AddEditForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock';

const FlightLocation = () => {
  
  return (
    <PageHeaderBlock Title={['Flight Location']} TableView={TableView} AddEditForm={AddEditForm} />
  )
}

export default FlightLocation