// import components
import LicenceTableView from '../../../components/simTrainingManagements/Licence/LicenceTableView'
import LicenceForm from '../../../components/simTrainingManagements/Licence/LicenceForm'
import PageHeaderBlock from '../../../components/commonComponents/PageHeaderBlock'


const Licence = () => (
    <PageHeaderBlock 
        Title={['Licence Information']} 
        TableView={LicenceTableView} 
        AddEditForm={LicenceForm}
    />
    
)

export default Licence