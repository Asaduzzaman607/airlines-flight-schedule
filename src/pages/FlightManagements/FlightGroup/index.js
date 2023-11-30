// import components
import TableView from '../../../components/flightManagements/FlightGroup/TableView'
import AddEditForm from '../../../components/flightManagements/FlightGroup/AddEditForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'

const FlightGroup = () => {
  
  return (
    <PageHeaderBlock Title={['Flight Group']} TableView={TableView} AddEditForm={AddEditForm} />
  )
}

export default FlightGroup