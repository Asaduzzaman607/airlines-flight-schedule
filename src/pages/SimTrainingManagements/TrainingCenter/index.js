// import components
import { PageHeaderBlock } from '../../../components/commonComponents'
import TrainingCenterForm from '../../../components/simTrainingManagements/Configurations/TrainingCenter/TrainingCenterForm'
import TrainingCenterTableView from '../../../components/simTrainingManagements/Configurations/TrainingCenter/TrainingCenterTableView'

const TrainingCenter = () => ( <PageHeaderBlock Title={['Training Center']} TableView={TrainingCenterTableView} AddEditForm={TrainingCenterForm} /> )

export default TrainingCenter