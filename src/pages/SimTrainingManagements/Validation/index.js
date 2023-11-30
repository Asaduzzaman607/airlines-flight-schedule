// import components
import ValidationTableView from '../../../components/simTrainingManagements/Validation/ValidationTableView'
import ValidationForm from '../../../components/simTrainingManagements/Validation/ValidationForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'


const Validation = () => (
    <PageHeaderBlock 
        Title={['Validation']} 
        TableView={ValidationTableView} 
        AddEditForm={ValidationForm}
    />
)

export default Validation