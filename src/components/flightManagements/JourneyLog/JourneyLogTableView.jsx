import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'

// import components
import EditableCell from './EditableCell';
import { Table } from 'antd';

// import custom css
import '../../../styles/JourneyLog.css'

// import actions and reducers
import { getJourneyLogList, saveJourneyLog } from '../../../services/actions/FlightManagementActions/journeyLogAction';
import { SearchBlock } from '../../commonComponents';
import { setSuccess } from '../../../services/reducers/JourneyLog/journeyLogReducer';

function JourneyLogTableView() {
    const { JourneyLogList, isLoading, search_date, success } = useSelector(state => state.journeyLog)

    const dispatch = useDispatch()
    const currentDate = dayjs();

    // structrue table column
    const columns = [
      {
          title: 'DATE',
          dataIndex: 'date',
          width: 150,
          height: 50,
          fixed: 'left'
      },
      {
          title: 'FLT DATA',
          children: [
            {
              title: 'FLTNO',
              dataIndex: 'flightNo',
              key: 'flightNo',
              width: 160,
            },
            {
              title: 'ACFT',
              dataIndex: 'aircraftName',
              key: 'aircraftName',
              width: 150,
            }
          ],
      },
      {
          title: 'SECTOR',
          children: [
            {
              title: 'FRM',
              dataIndex: 'fromIcaoCode',
              key: 'fromIcaoCode',
              width: 160,
            },
            {
              title: 'TO',
              dataIndex: 'toIcaoCode',
              key: 'toIcaoCode',
              width: 150,
            }
          ],
      },
      {
          title: 'SKD TIME',
          children: [
            {
              title: 'STD',
              dataIndex: 'standardDepartTime',
              key: 'standardDepartTime',
              width: 160,
            },
            {
              title: 'STA',
              dataIndex: 'standardArriveTime',
              key: 'standardArriveTime',
              width: 150,
            }
          ],
      },
      {
          title: 'BLOCK TIME',
          children: [
            {
              title: <RenderTitle title={'BLOCK OFF'}/>,
              dataIndex: 'blockOffTime',
              key: 'blockOffTime',
              width: 160,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('blockOffTime', value, record)}
                    type='date'
                    success={success}
                  />
              ),
            },
            {
              title: <RenderTitle title={'BLOCK ON'}/>,
              dataIndex: 'blockOnTime',
              key: 'blockOnTime',
              width: 150,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('blockOnTime', value, record)}
                    type='date'
                    success={success}
                  />
              ),
            },
            {
              title: 'BLOCK TIME',
              dataIndex: 'blockTime',
              key: 'blockTime',
              width: 150,
            }
          ],
      },
      {
          title: 'AIR TIME',
          children: [
            {
              title: <RenderTitle title={'T/O TIME'}/>,
              dataIndex: 'takeOffTime',
              key: 'takeOffTime',
              width: 160,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('takeOffTime', value, record)}
                    type='date'
                    success={success}
                  />
                ),
            },
            {
              title: <RenderTitle title={'LAND TIME'}/>,
              dataIndex: 'landTime',
              key: 'landTime',
              width: 150,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('landTime', value, record)}
                    type='date'
                    success={success}
                  />
                ),
            },
            {
              title: 'FLT TIME',
              dataIndex: 'flightTime',
              key: 'flightTime',
              width: 150,
            }
          ],
      },
      {
        title: 'PILOT AIR TIME',
        children: [
            {
              title: 'TAKE OFF TIME',
              dataIndex: 'picTakeOffTime',
              key: 'picTakeOffTime',
              width: 150,
            },
            {
                title: 'LAND TIME',
                dataIndex: 'picLandTime',
                key: 'picLandTime',
                width: 160,
            },
        ],
      },
      {
          title: 'CREW RECORDS',
          children: [
            {
              title: 'NAV TIME',
              dataIndex: 'navTime',
              key: 'navTime',
              width: 160,
            },
            {
              title: 'INSTR TIME',
              dataIndex: 'instrTime',
              key: 'instrTime',
              width: 150,
            },
            {
              title: <RenderTitle title={'NIGHT TIME'}/>,
              dataIndex: 'nightTime',
              key: 'nightTime',
              width: 150,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('nightTime', value, record)}
                    type='date'
                    success={success}
                  />
                ),
            },
            {
              title: 'T/O',
              children: [
                  {
                      title: <RenderTitle title={'P1/P2'}/>,
                      dataIndex: 'takeOffPilot',
                      key: 'takeOffPilot',
                      width: 160,
                      editable: true,
                      render: (text, record) => (
                          <EditableCell
                            value={text}
                            onSave={value => handleEdit('takeOffPilot', value, record)}
                            type='select'
                            success={success}
                          />
                        ),
                  }
              ]
            },
            {
              title: 'LDG',
              children: [
                  {
                      title: <RenderTitle title={'P1/P2'}/>,
                      dataIndex: 'landingPilot',
                      key: 'landingPilot',
                      width: 160,
                      editable: true,
                      render: (text, record) => (
                          <EditableCell
                            value={text}
                            onSave={value => handleEdit('landingPilot', value, record)}
                            type='select'
                            success={success}
                          />
                        ),
                  }
              ]
            }
          ],
      },
      {
          title: 'FUEL RECORD',
          children: [
            {
              title: <RenderTitle title={'RAMP FUEL'}/>,
              dataIndex: 'rampFuel',
              key: 'rampFuel',
              width: 160,
              editable: true,
              render: (text, record) => (
                <EditableCell
                    value={text}
                    onSave={value => handleEdit('rampFuel', value, record)}
                    type='number'
                    success={success}
                />
              ),
            },
            {
              title: <RenderTitle title={'ACTL FUEL'}/>,
              dataIndex: 'actualFuel',
              key: 'actualFuel',
              width: 150,
              editable: true,
              render: (text, record) => (
                <EditableCell
                    value={text}
                    onSave={value => handleEdit('actualFuel', value, record)}
                    type='number'
                    success={success}
                />
              ),
            },
            {
              title: <RenderTitle title={'ARR'}/>,
              dataIndex: 'arr',
              key: 'arr',
              width: 150,
              editable: true,
              render: (text, record) => (
                  <EditableCell
                    value={text}
                    onSave={value => handleEdit('arr', value, record)}
                    type='number'
                    success={success}
                  />
                ),
            },
            {
              title: 'CONSUMED',
              dataIndex: 'consumed',
              key: 'consumed',
              width: 150,
            }
          ],
      },
      {
            title: 'WIND DATA',
            children: [
                {
                    title: <RenderTitle title={'IN BOUND'}/>,
                    dataIndex: 'inBound',
                    key: 'inBound',
                    width: 160,
                    editable: true,
                    render: (text, record) => (
                        <EditableCell
                        value={text}
                        onSave={value => handleEdit('inBound', value, record)}
                        type='text'
                        success={success}
                        />
                    ),
                },
                {
                    title: <RenderTitle title={'OUT BOUND'}/>,
                    dataIndex: 'outBound',
                    key: 'outBound',
                    width: 150,
                    editable: true,
                    render: (text, record) => (
                        <EditableCell
                        value={text}
                        onSave={value => handleEdit('outBound', value, record)}
                        type='text'
                        success={success}
                        />
                    ),
                },
            ],
        },
    ];
    
    // save or submit handler
    function handleEdit(column, value, key) {
        // Handle the cell value change here
        const data = {
            id: key?.id,
            dailyFlightPlanId: key?.dailyFlightPlanId,
            [column]:value,
            date: search_date ?? currentDate.format('YYYY-MM-DD')
        } 
        
        if(value === 'N/A' || key[column] == value || value <= 0) {
            dispatch(setSuccess(false))
            return;
        } 
        dispatch(saveJourneyLog(data))
    }

    useEffect(() => {
        dispatch(getJourneyLogList({ date: currentDate.format('YYYY-MM-DD') }))
    }, [])
    
    return (
        <div className={'overflow-hidden bg-white px-4 py-3 rounded-md'}>
            <SearchBlock action={ getJourneyLogList } from="journeyLog"/>
            <Table 
                bordered
                className={"my-custom-table"}
                loading={isLoading}
                dataSource={JourneyLogList} 
                columns={columns} 
                scroll={{
                    y: 'calc(100vh - 358px)',
                    x: 1500
                }}
                pagination={false}
            />
        </div>
    ) 
}

// render title component
export const RenderTitle = ({title}) => {
    return (
        <div style={{backgroundColor: '#e0e0de', padding: '12px', fontWeight: 'bold', color: 'black' }}> { title } </div>
    )
}

export default JourneyLogTableView;
