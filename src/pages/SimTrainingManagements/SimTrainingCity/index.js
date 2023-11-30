// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import CityForm from '../../../components/simTrainingManagements/Configurations/City/SimTrainingCityForm'
import CityTableView from '../../../components/simTrainingManagements/Configurations/City/SimTrainingCityTableView'

const SimTrainingCity = () => ( <PageHeaderBlock Title={['City']} TableView={CityTableView} AddEditForm={CityForm} /> )

export default SimTrainingCity