// import components
import { Table } from 'antd'

// import custom hooks
import useAssignAircraft from './useAssignAircraft'

const AircraftListTable = () => {
    const { data, columns, handleRowsOnChange } = useAssignAircraft()
    return (
        <div>
            <Table
                pagination={ false }
                dataSource={ data }
                columns={ columns }
                rowSelection={ {
                    type: 'checkbox',
                    getCheckboxProps: record => ({
                        disabled: record?.assignedAircraft,
                        name: !record?.assignedAircraft
                    }),
                    onChange: handleRowsOnChange,
                    hideSelectAll: true,
                } }
                scroll={ {
                    y: 'calc(100vh - 244px)',
                } }
                size={ 'small' }
            />
        </div>
    )
}

export default AircraftListTable