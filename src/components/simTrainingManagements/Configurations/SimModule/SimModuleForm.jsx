import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import comapreWithLodash from "lodash"

// import antd componets
import { Button, Form, Input } from 'antd'

// import action
import { addSimModule, editSimModuleList } from '../../../../services/actions/SimTrainingManagementActions/simModuleAction'
import { getErrorMsg, showAlert } from '../../../../services/actions/commonActions'

// import api config
import { SIM_TRAINING } from '../../../../config'

function SimModuleForm() {
    const [rowdata,setRowdata] = useState({})
    const { success, isLoading } = useSelector(state => state.simModule)
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
            // let { countryName, ...extractRowData } = rowdata
            if(comapreWithLodash.isEqual(values, rowdata)) {
                // show success message
                showAlert('success', 'Successfully Updated.')
                return navigate(parent)
            } 

            dispatch(editSimModuleList(values))
        } else {
            dispatch(addSimModule(values))
        } 
    }

    //reset form data
    const _onReset = () => {
        form.resetFields()
    }

    const inputField = (item) => {
        const { type, label } = item;
        const _components = {
            text: <Input type={'text'} placeholder={`Enter ${label}`} />,
            textarea: <Input.TextArea type={'text'} placeholder={`Enter ${label}`} />,
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
                const response = await axios.get(SIM_TRAINING.GET_SIM_MODULE + id)
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
    }, [id])

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
                        { inputField(field) }
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

export default SimModuleForm

// initial input field and value
const addEditInfoFields = [
    {
        id: 1,
        name: 'name',
        label: 'SIM Module Name',
        type: 'text',
        rules: [
            {
                type: 'text',
                message: 'The input is not valid name',
            },
            {
                required: true,
                message: 'SIM module is required.',
            },
        ],
    },
    {
        id: 2,
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rules: [
            {
                type: 'textarea',
                message: 'The input is not valid',
            },
            {
                required: true,
                message: 'Description is required.',
            },
        ],
    },
]