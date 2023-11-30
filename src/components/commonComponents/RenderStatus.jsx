import { Tag } from 'antd'
export const RenderApprovalStatus = ({ text }) => {
  const _setStatusColor = (value) => {
    if (value === 'PENDING') {
      return 'orange';
    }
    if (value === 'COMPLETED' || value === 'APPROVED') {
      return 'green';
    }
    if (value === 'DELAYED' || value === 'REVIEWED') {
      return 'purple';
    }
    if (value === 'CANCELLED' || value === 'REJECTED') {
      return 'red';
    }
    return '#8c8c8c';
  };
  return <Tag color={_setStatusColor(text)}>{text}</Tag>;
}