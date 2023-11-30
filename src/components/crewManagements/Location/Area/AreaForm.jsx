import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { Button, Form, Input, InputNumber, DatePicker } from 'antd'

// import action
import { addArea, editAreaList } from '../../../../services/actions/CrewManagementActions/areaAction'

// import role config
import { LOCATION } from '../../../../config'

function AreaForm() {
    const [rowdata,setRowdata] = useState({})
    const { success, isLoading } = useSelector(state => state.area)
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
            let { description, ...extractRowData } = rowdata
            if(comapreWithLodash.isEqual(values, extractRowData)) return navigate(parent)

            dispatch(editAreaList(values))
        } else {
            dispatch(addArea(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (type) => {
        const _components = {
            text: <Input type={'text'} placeholder="Enter here!" />,
            textarea: <Input.TextArea type={'text'} placeholder="Enter details here!" />,
            password: <Input.Password type={'password'} placeholder="Enter password here!" />,
            number: <InputNumber type={'number'} placeholder="Enter number here!" />,
            email: <Input type={'email'} placeholder="Enter your email here!" />,
            date: <DatePicker showTime />
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
        const _fetchData = async () => {
            try {
                const response = await axios.get(LOCATION.GET_AREA + id)
                setRowdata(response.data)
                form.setFieldsValue(response.data)
            } catch (error) {
                console.error(error);
            }
        }

        if(id) {
            _fetchData()
        }
    }, [ id ])

    return (
        <div className='bg-white py-3 rounded-md'>
            <Form
            validateTrigger={'onChange'}
            form={form}
            onFinish={_onFinish}
            scrollToFirstError
            layout={'vertical'}
            autoComplete={ 'off' }
            >
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:p-5'>
                {
                addEditInfoFeilds?.map(feild => (
                    <Form.Item
                        key={feild.id}
                        name={feild.name}
                        label={feild.label}
                        rules={feild.rules}
                        dependencies={feild.dependencies ?? []}
                    >
                        { inputField(feild?.type) }
                    </Form.Item>
                ))
                }
            </div>
            <Form.Item style={{marginLeft: '17px'}}>
                <Button htmlType={'submit'} type={'primary'} loading={ isLoading } style={{ margin: '5px' }}>{ id ? 'Update' : 'Submit' }</Button>
                {!id && <Button htmlType={'reset'} onClick={() => _onReset}>{ 'Reset' }</Button>}
            </Form.Item>
            </Form>
        </div>
    )
}


export default AreaForm

// initial input field and value
const addEditInfoFeilds = [
    {
        id: 1,
        name: 'name',
        label: 'Area Name',
        type: 'text',
        rules: [
        {
            type: 'text',
            message: 'The input is not valid name',
        },
        {
            required: true,
            message: 'Please input Area name!',
        },
        ],
    },
    {
        id: 2,
        name: 'code',
        label: 'Area Code',
        type: 'text',
        rules: [
        {
            type: 'text',
            message: 'The input is not valid',
        },
        {
            required: true,
            message: 'Please write Area code!',
        },
        ],
    },
]