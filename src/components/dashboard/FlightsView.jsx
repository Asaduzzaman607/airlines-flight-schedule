import { useSelector } from 'react-redux'

// import components
import { Table } from 'antd'
import { HeaderTitleOccDashboard } from './index'

const sharedOnCell = (record) => {
    if (record?.flt?.is_parent) {
        return {
            colSpan: 0,
        };
    }
    return {};
}

// FLT VIEW
const FltView = ({ label_1, label_2, list }) => {
    return (
        <div className={'flex flex-col'}>
            {
                label_1 && (
                    <div>{ label_1 }</div>
                )
            }
            {
                label_2 && (
                    <div>{ label_2 }</div>
                )
            }
            {
                list?.length > 0 && list?.map(i => (
                    <div key={i?.id}>{ i?.name }</div>
                ))
            }
        </div>
    )
}

const StandByContainer = ({ standByList }) => {
    return (
        <div className={'absolute left-0 top-0 sticky z-10 !flex !flex-col'}>
            {
                standByList?.length > 0 && standByList.map(sBList => (
                    <div className={'space-y-2'}>
                        <div key={sBList?.aircraftType} className={'font-semibold'}>{sBList?.aircraftType}</div>
                        {
                            sBList?.crewList && sBList?.crewList?.length > 0 && (
                                <div className={'last:pb-3'}>
                                    {
                                        sBList?.crewList.map(item => (
                                            <div key={item?.id ?? 'sBList' + item?.name + 'name'}>
                                                { item?.name }
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                ))
            }
        </div>
    )
}

const columns = [
    {
        title: 'FLT',
        dataIndex: 'flt',
        key: 'flt',
        onCell: (record) => {
            if (record?.flt?.is_parent) {
                return { colSpan: 9 };
            }
        },
        render: (text) => <FltView
            label_1={text.is_parent ? text?.label : text?.departureFlightNo }
            label_2={!text.parent && text?.arrivalFlightNo}
        />,
        width: 140,
        fixed: 'left',
    },
    {
        title: 'DEP - ARR',
        dataIndex: 'depArr',
        key: 'depArr',
        onCell: sharedOnCell,
        width: 140,
        fixed: 'left',
        render: text => (
            <FltView label_1={text?.departureTime} label_2={text?.arrivalTime} />
        ),
        align: 'center'
    },
    {
        title: 'SECTOR',
        dataIndex: 'sector',
        key: 'sector',
        onCell: sharedOnCell,
        width: 140,
        fixed: 'left',
        align: 'center',
        render: text => <FltView label_1={text?.departureSector} label_2={text?.arrivalSector} />
    },
    {
        title: 'PIC',
        dataIndex: 'captain',
        onCell: sharedOnCell,
        align: 'center',
        render: (item) => <FltView list={item?.length > 0 ? item : []} />,
        width: 150
    },
    {
        title: 'SIC',
        dataIndex: 'firstOfficer',
        onCell: sharedOnCell,
        render: (item) => <FltView list={item?.length > 0 ? item : []} />,
        width: 150,
        align: 'center'
    },
    {
        title: 'CABIN CREW',
        dataIndex: 'cabinCrew',
        onCell: sharedOnCell,
        render: (item) => <FltView list={item?.length > 0 ? item : []} />,
        width: 150,
        align: 'center'
    },
    {
        title: 'OBS/R. ENGR',
        dataIndex: 'obsEngr',
        onCell: sharedOnCell,
        render: (item) => <FltView list={item?.length > 0 ? item : []} />,
        width: 150,
        align: 'center'
    },
    {
        title: 'AID',
        children: [
            {
                title: 'ORIGIN',
                dataIndex: 'origin',
                onCell: sharedOnCell,
                width: 150,
                align: 'center'
            },
            {
                title: 'OUT ST.',
                dataIndex: 'outStation',
                onCell: sharedOnCell,
                width: 150,
                align: 'center'
            }
        ]
    },
    {
        title: 'S/BY CREW',
        dataIndex: 'standBy',
        onCell: (_, index) => {
            return { rowSpan: index > 0 ? 0 : 80 }
        },
        render: (item) => <StandByContainer standByList={item?.length > 0 ? item : []} />,
        width: 220,
    },
];

const FlightsView = () => {
    const { isOccDataLoading, occData, submittedDate } = useSelector(state => state.dashboard)
    return (
        <div className={'bg-white px-4 py-3 rounded-md'}>
            <Table
                columns={columns}
                dataSource={occData}
                bordered
                size={'small'}
                pagination={false}
                expandable={{ defaultExpandAllRows: true }}
                // defaultExpandAllRows={true}
                scroll={{
                    y: 'calc(100vh - 278px)',
                    x: 'calc(100wh - 340px)',
                }}
                loading={isOccDataLoading}
                showHeader={true}
                title={submittedDate ? () => <HeaderTitleOccDashboard /> : undefined}
            />
        </div>
    )
}

export default FlightsView