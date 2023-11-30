// import alert component
import { notification, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

// get error msg
const getErrorMsg = err => (err?.response?.data?.apiErrors?.[0]?.message) ?? err?.message ?? 'Something went wrong.'

// show alert
const showAlert = (type, msg, duration) => {
    notification[type]({
        message: msg ?? 'Something went wrong.',
        style: { background: _getAlertColor(type) },
        duration: duration ?? 4.5
    })
}

// show delete modal
const ShowDeleteAlert = (action, id, dispatch, pagination, stored_SearchBlock_Value, title='Are you sure delete this item?') => {
    confirm({
        title: title,
        icon: <ExclamationCircleOutlined />,
        // content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
            dispatch(action(id, pagination, stored_SearchBlock_Value))
            // return true
        },
        onCancel() {},
    });
};

// get alert bg color according to alert type
const _getAlertColor = type => {
    const colors = {
        success: '#f6ffed', // border color: '#b7eb8f'
        error: '#fff2f0', // border color: '#ffccc7'
        warning: '#fffbe6', // border color: '#ffe58f'
        info: '#e6f7ff' // border color: '#91d5ff'
    }
    return colors[type] ?? ''
}

// validate password field
const passwordValidation = (value) => {
    if (value && value.length >= 6) {
        if (/\d/.test(value) && /[a-zA-Z]/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(
            'Password must contain at least one letter and one number.'
        );
    }
    return Promise.reject('Password must be at least 6 characters long.');
}

// export actions
export { getErrorMsg, showAlert, ShowDeleteAlert, passwordValidation }