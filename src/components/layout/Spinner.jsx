// Import Components
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Spinner = () => (
    <Spin indicator={<LoadingOutlined spin style={{ fontSize: 56 }} />} />
)

export default Spinner