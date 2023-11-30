// import components
import { PageHeaderBlock } from "../../../components/commonComponents"
import FlyingTimeForm from "../../../components/crewManagements/FlyingTime/FlyingTimeForm"
import FlyingTimeTableView from "../../../components/crewManagements/FlyingTime/FlyingTimeTableView"

const FlyingTime = () => (
    <PageHeaderBlock Title={['Flying Time List']} TableView={FlyingTimeTableView} AddEditForm={FlyingTimeForm} />
)

export default FlyingTime