import { useState } from 'react'
import { useDispatch } from 'react-redux'

// import components
import { Badge, Button, Form, Modal } from 'antd'
import { CustomTextArea } from './CustomFormField'

export default function RemarksModal({ reqBody, title, setIsOpenRemarksModal, action, getTableDataAction }) {
    const [isModalOpen, setIsModalOpen] = useState(true)
    
    const dispatch = useDispatch()

    // save or submit hamdler
    const onFinish = (values) => {
        const res = {
            ...reqBody,
            remarks: values.remarks
        }
        dispatch(action(res, getTableDataAction))
        setIsOpenRemarksModal(false)
    }

    // close modal
    const handleCancel = () => {
        setIsModalOpen(false)
        setIsOpenRemarksModal(false)
    }
    
    return (
        <div>
            <Modal 
                maskClosable={false} 
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <div className={'pt-5'}>
                    <Badge.Ribbon text={'Remarks'} placement='start'>
                        <div className={'p-4 pt-10 flex justify-center border-solid border-2 border-gray-200 rounded-lg shadow-inner gap-5 mb-6'}>
                            <Form
                                name="reset"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                style={{
                                    minWidth: 420,
                                    maxWidth: 200
                                }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        {
                                            type: 'textarea',
                                            message: 'Remarks cannot be empty.',
                                        },
                                        {
                                            required: true,
                                            message: 'Remarks is required.'
                                        }
                                    ]}
                                >
                                    <CustomTextArea type={'text'} placeholder={'Enter remarks'}/>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button 
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginTop: '15px' }}
                                    >
                                        { title }
                                    </Button>
                                    <Button 
                                        htmlType={'cancel'} 
                                        onClick={handleCancel}
                                        style={{marginLeft: '10px', backgroundColor: 'red', color: 'white'}}
                                    >
                                        {'Cancel'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Badge.Ribbon>
                </div>
            </Modal>
        
        </div>
    )
}
