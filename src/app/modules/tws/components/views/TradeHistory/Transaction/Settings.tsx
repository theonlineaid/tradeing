import React, {useState} from 'react'
import {Tab, Tabs} from 'react-bootstrap'
import CheckList from '../../../../../../common/components/ui/CheckList'
import TransactionFilter from './TransactionFilter';

const TradeHistorySettings = ({checkData, handleCheckData}) => {
  const [activeSettingTab, setActiveSettingTab] = useState<string>('column')
  return (
    <Tabs
      defaultActiveKey={activeSettingTab}
      activeKey={activeSettingTab}
      transition={false}
      id='noanim-tab-example'
      className='mb-3'
      onSelect={(k: string | null, e: React.SyntheticEvent<unknown>) =>
        setActiveSettingTab(k ?? '')
      }
    >
      <Tab eventKey='column' title='Columns'>
        <ul className='d-flex flex-wrap p-0'>
          {checkData &&
            checkData.map((check) => (
              <CheckList key={check.field} check={check} handleCheckData={handleCheckData} />
            ))}
        </ul>
      </Tab>
      <Tab eventKey='filter' title='Filter'>
      {/* <OrderListFilter
          client={client}
          currentDate={new Date()}
          handleChange={handleChange}
          values={values}
        /> */}
        <p>filter</p>
      </Tab>
    </Tabs>
  )
}

export default TradeHistorySettings
