// import components
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const CustomTab = ({ activeKey, onChange, tabs, ...rest }) => {
  return (
    <Tabs activeKey={activeKey} onChange={onChange}>
      {tabs?.length && tabs?.map((tab) => (
        <TabPane tab={tab?.title} key={tab?.key}>
          {tab?.content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default CustomTab;
