import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import axios from 'axios'
import compareWithLodash from "lodash"

// import antd components
import { Button, Form, Input, InputNumber, Select } from 'antd'

// import api config
import { AIRPORT } from '../../../config'

// import redux action
import { addAirport, editAirportList } from '../../../services/actions/FlightManagementActions/airportAction'

// Airport Create or Update Function
function AddEditForm() {

    const [rowdata,setRowdata] = useState({})
    const { success, isLoadingAddUser } = useSelector(state => state.airport)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const isLayover = Form.useWatch('isLayover', form)

    // Save or Submit Handler
    const _onFinish = values => {
        // trim extra space
        values.code = values.code.trim()
        values.icaoCode = values.icaoCode.trim()

        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            if(compareWithLodash.isEqual(values, rowdata)) return navigate(parent);
            dispatch(editAirportList(values))
        } else {
            dispatch(addAirport(values))
        } 
    };

    // Handle and Reset form value
    const _onReset = () => {
        form.resetFields()
    }

    // define field structure
    const addEditInfoFeilds = [
        {
            id: 1,
            name: 'name',
            label: 'Airport Name',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'Airport name is not valid',
                },
                {
                    required: true,
                    message: 'Airport name is required.',
                },
            ]
        },
        {
            id: 2,
            name: 'code',
            label: 'IATA Code',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'IATA code is not valid',
                },
                {
                    required: true,
                    message: 'IATA code is required.',
                },
            ]
        },
        {
            id: 6,
            name: 'icaoCode',
            label: 'ICAO Code',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'ICAO Code is not valid',
                },
                {
                    required: true,
                    message: 'ICAO code is required.',
                },
            ]
        },
        {
            id: 3,
            name: 'latitude',
            label: 'Latitude',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'Latitude is not valid',
                },
                {
                    required: true,
                    message: 'Latitude is required.',
                },
            ]
        },
        {
            id: 4,
            name: 'longitude',
            label: 'Longitude',
            type: 'text',
            rules: [
                {
                    type: 'text',
                    message: 'Longitude is not valid',
                },
                {
                    required: true,
                    message: 'Longitude is required.',
                },
            ]
        },
        {
            id: 6,
            name: 'isLayover',
            label: 'Layover',
            type: 'isLayover',
            rules: [
              {
                type: 'select',
                message: 'Layover is not valid',
              },
              {
                required: true,
                message: 'Layover is required.',
              },
            ],
        },
        {
            id: isLayover ? 7 : null,
            name: 'layoverHours',
            label: 'Layover Hour',
            type: 'number',
            rules: [
              {
                type: 'number',
                message: 'Layover hour is not valid',
              },
              {
                required: true,
                message: 'Layover hour is required.',
              },
            ],
        },
        {
            id: 5,
            name: 'description',
            label: 'Description',
            type: 'textarea',
            rules: [
                {
                    type: 'textarea',
                    message: 'Description is not valid',
                },
                {
                    required: false,
                    message: 'Description is required.',
                },
            ]
        },
    ]

    // initial input fields and values
    const inputField = ({ type, label }) => {
        const _components = {
            text: <Input type={'text'} placeholder={`Enter ${label}`}/>,
            textarea: <Input.TextArea type={'text'} placeholder={`Enter ${label}`} />,
            password: <Input.Password type={'password'} placeholder={`Enter ${label}`} />,
            number: <InputNumber type={'number'} style={{width: '100%'}} placeholder={`Enter ${label}`} />,
            isLayover: (
                <Select placeholder={`Enter ${label}`}>
                    <Select.Option value={true}> YES </Select.Option>
                    <Select.Option value={false}> NO </Select.Option>
                </Select>
            )
        }

        return _components[type]
    }

    // It render when submit edit form
    useEffect(() => {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [success])

    useEffect(()=> { 
        const _fetchData = async () => {
            try {
                const response = await axios.get(AIRPORT.GET_AIRPORT_LIST + id)
                setRowdata(response?.data)
                form.setFieldsValue(response?.data)
            } catch (error) {
                console.error(error)
            }
        }
        if(id) {
            // get single row data for edit
            _fetchData()
        }
    },[id])

    return (
        <div className={'bg-white py-3 rounded-md shadow-md'}>
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
                        addEditInfoFeilds?.map(field => (
                            field?.id && <Form.Item
                                key={field.id}
                                name={field.name}
                                label={field.label}
                                rules={field.rules}
                                dependencies={field.dependencies ?? []}
                            >
                                {inputField(field)}
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
                        { id ? 'Update' : 'Submit' }
                    </Button>
                    {
                        !id && <Button htmlType={'reset'} onClick={() => _onReset}>{'Reset'}</Button>
                    }
                </Form.Item>
            </Form>
        </div>
    )
}

// export components
export default AddEditForm