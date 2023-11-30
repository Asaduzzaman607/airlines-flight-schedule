import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { Button, Form, Input, Select } from 'antd'

// import action
import { addCity, editCityList } from '../../../../services/actions/SimTrainingManagementActions/cityAction'
import { getCountryList } from '../../../../services/actions/CrewManagementActions/countryAction'
import { getErrorMsg, showAlert } from '../../../../services/actions/commonActions'

// import api config
import { SIM_TRAINING } from '../../../../config'

function SimTrainingCityForm() {
    const [rowdata,setRowdata] = useState({})
    const { success, isLoading } = useSelector(state => state.city)
    const { countryList } = useSelector(state => state.country)
    const { routePermissions } = useSelector(state => state.auth)

    // destructure parent path name 
    const { parent } = routePermissions

    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // save or submit handler
    const _onFinish = values => {
        // dispatch to add and edit action
        if(id) {
            values.id = Number(id)
            let { countryName, ...extractRowData } = rowdata
            if(comapreWithLodash.isEqual(values, extractRowData)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent)
            } 

            dispatch(editCityList(values))
        } else {
            dispatch(addCity(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter city name" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here" />,
            selectCountry: (
                <Select placeholder={'Select country'}>
                  {countryList?.map((item) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
            ),
        }
        
        return _components[type] || null
    }

    useEffect(() => {
        if(id) {
            // For edit form , If api response has successfully done then re-direct to parent path 
            success && navigate(parent)
        }
    }, [ success ])

    useEffect(()=> {
        dispatch(getCountryList({ page: 0, pageSize: 100 }));
        const _fetchData = async () => {
            try {
                const response = await axios.get(SIM_TRAINING.GET_CITY + id)
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (error) {
                console.error(error);
                const errMsg = getErrorMsg(error)

                // show error msg
                showAlert('error', errMsg)
            }
        }

        if(id) {
            _fetchData()
        }
    }, [ ])

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
                        { inputField(field?.type) }
                    </Form.Item>
                ))
                }
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
                <Button 
                    htmlType={'submit'} 
                    type={'primary'} 
                    loading={ isLoading } 
                    style={{ margin: '5px' }}
                >
                    { id ? 'Update' : 'Submit' }
                </Button>
                {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{ 'Reset' }</Button>}
            </Form.Item>
            </Form>
        </div>
    )
}

export default SimTrainingCityForm

// initial input field and value
const addEditInfoFields = [
    {
        id: 2,
        name: 'countryId',
        label: 'Country',
        type: 'selectCountry',
        rules: [
            {
                type: 'select',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Country is required.',
            },
        ],
    },
    {
        id: 1,
        name: 'name',
        label: 'City Name',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid name',
            },
            {
                required: true,
                message: 'City name is required.',
            },
        ],
    },
]