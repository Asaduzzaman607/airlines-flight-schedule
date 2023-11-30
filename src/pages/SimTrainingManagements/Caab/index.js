// import components
import CaabTableView from '../../../components/simTrainingManagements/Caab/CaabTableView'
import CaabForm from '../../../components/simTrainingManagements/Caab/CaabForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'


const Licence = () => (
    <PageHeaderBlock 
        Title={['CAAB Corresponding']} 
        TableView={CaabTableView} 
        AddEditForm={CaabForm}
    />
)

export default Licence