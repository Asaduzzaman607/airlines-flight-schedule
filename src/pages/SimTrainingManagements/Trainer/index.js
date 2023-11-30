// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import TrainerForm from '../../../components/simTrainingManagements/Configurations/Trainer/TrainerForm'
import TrainerTableView from '../../../components/simTrainingManagements/Configurations/Trainer/TrainerTableView'

const Trainer = () => ( <PageHeaderBlock Title={['Trainer']} TableView={TrainerTableView} AddEditForm={TrainerForm} /> )

export default Trainer