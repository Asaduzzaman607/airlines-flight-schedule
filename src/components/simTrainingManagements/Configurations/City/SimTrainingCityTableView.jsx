import { useSelector } from 'react-redux'

// import components
import { SearchBlock, TableAction, TableBlock } from '../../../commonComponents'
import { IconHandler } from '../../../commonComponents/CommonItems'

// import icons
import { GiModernCity } from 'react-icons/gi'
import { BsFlagFill } from 'react-icons/bs'

// import redux actions
import { getCitySearchList, deleteCity } from '../../../../services/actions/SimTrainingManagementActions/cityAction'

const CityTableView = () => {
    // get City state values from redux
    const { isLoading, cityList, pagination } = useSelector(state => state.city)

    // column list for search
    const searchableColumnLists = [
        {
            id: 0,
            label: 'City Name',
            value: 'name'
        },
    ]

    const columns = [
        {
            title: 'City Name',
            dataIndex: 'name',
            key: 'name',
            render: (item) => <IconHandler item={item} ICON={GiModernCity}/>
        },
        {
            title: 'Country',
            dataIndex: 'countryName',
            key: 'countryName',
            render: (item) => <IconHandler item={item} ICON={BsFlagFill}/>
        },
        {
            title: 'Actions',
            key: 'action',
            render: (record) => <TableAction rowInfo={ record } deleteAction={ deleteCity } pagination={ pagination } />
        },
    ]

    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getCitySearchList } searchableColumnLists={ searchableColumnLists }/>
            <TableBlock 
                action={getCitySearchList}
                columns={columns}
                dataList={cityList}
                pagination={pagination} 
                isLoading={isLoading} 
            />
        </div>
    )
}

export default CityTableView