import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd components
import { TagRender } from '../../commonComponents'
import { Button, Form, Input, InputNumber, DatePicker, Select } from 'antd'

// import action
import { addAirportPair, editAirportPair } from '../../../services/actions/FlightManagementActions/airportPairAction'
import { getAirportList } from '../../../services/actions/FlightManagementActions/airportAction'
import { getAircraftTypeList } from '../../../services/actions/FlightManagementActions/aircraftTypeAction'
import { showAlert } from '../../../services/actions/commonActions'

// import role config
import { AIRPORT_PAIR } from '../../../config'

function AddEditForm() {
    const [rowdata,setRowdata] = useState({})
    const [searchvalue, setSerchValue] = useState([])
    const { success, isLoadingAddUser } = useSelector(state => state.airportpair)
    const { aircraftTypeList } = useSelector(state => state.aircrafttype)
    const { airportList } = useSelector(state => state.airport)
    const { routePermissions } = useSelector(state => state.auth)
    
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // destructure parent path name 
    const { parent } = routePermissions

    const _onFinish = values => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            let { aircraftTypeName, fromAirportName, leg, toAirportName, ...getdata } = rowdata
            if(comapreWithLodash.isEqual(values, getdata)) {
                // show success message
                showAlert('success', 'Successfully Updated !!')
                return navigate(parent);
            }

            dispatch(editAirportPair(values))
        } else {
            dispatch(addAirportPair(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={ 'text'} placeholder="Enter here!" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            number: <InputNumber type={'number'} placeholder="Enter number here!" />,
            date: <DatePicker showTime />,
            select: (
                <Select
                    showSearch
                    allowClear
                    style={{
                    width: '100%',
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={searchvalue}
                />
            ),
            aircraftTypeIds: (
                <Select
                    showSearch
                    mode="multiple"
                    allowClear
                    tagRender={TagRender}
                    showArrow
                    style={{
                        width: '100%',
                    }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={aircraftTypeList.map((item) => ({label: item?.name, value: item?.id}))}
                />
            )
        }

        return _components[type] || null;
    }

    useEffect(() => {
        let data = airportList.map((item) => ({label: item?.name + ` (${item?.code})`, value: item?.id}))
        setSerchValue(data?.length ? data : [])
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success, airportList])

    useEffect(() => {
        const _fetchData = async () => {
            try {
                const response = await axios.get(AIRPORT_PAIR.GET_AIRPORT_PAIR_LIST + id)
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        if(id) _fetchData();
    }, [ id ])

    useEffect(()=> {
        // get airport pair list for select box
        let pageWithSize = { page: 0, pageSize: 200 }
        dispatch(getAirportList(pageWithSize))
        dispatch(getAircraftTypeList(pageWithSize))
    },[])

    return (
        <div className={'bg-white py-3 rounded-md'}>
            <Form
                validateTrigger={'onChange'}
                form={form}
                onFinish={_onFinish}
                scrollToFirstError
                layout={'vertical'}
                autoComplete={'off'}
            >
                <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'}>
                    {
                        addEditInfoFields?.map(field => (
                            <Form.Item
                                key={field.id}
                                name={field.name}
                                label={field.label}
                                rules={field.rules}
                                dependencies={field.dependencies ?? []}
                            >
                                {inputField(field?.type)}
                            </Form.Item>
                        ))
                    }
                </div>
                <Form.Item style={{marginLeft: '17px'}}>
                    <Button 
                        htmlType={'submit'} 
                        type={'primary'} 
                        loading={ isLoadingAddUser } 
                        style={{ margin: '5px' }}
                    >
                        { id ? 'Update' : 'Submit'}
                    </Button>
                    {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>}
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddEditForm

const addEditInfoFields = [
    {
        id: 1,
        name: 'fromAirportId',
        label: 'Start Airport Name',
        type: 'select',
        rules: [
        {
            type: 'select',
            message: 'The input is not valid',
        },
        {
            required: true,
            message: 'Please select start airport!',
        },
        ],
    },
    {
        id: 2,
        name: 'toAirportId',
        label: 'End Airport Name',
        type: 'select',
        rules: [
        {
            type: 'select',
            message: 'The input is not valid',
        },
        {
            required: true,
            message: 'Please select end airport!',
        },
        ],
    },
    {
        id: 3,
        name: 'aircraftTypeIds',
        label: 'Aircraft Type',
        type: 'aircraftTypeIds',
        rules: [
        {
            type: 'select',
            message: 'The input is not valid',
        },
        {
            required: true,
            message: 'Please select aircraft type!',
        },
        ],
    },
]