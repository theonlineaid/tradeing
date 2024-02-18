import React, {useState} from 'react'
import {Tab, Tabs} from 'react-bootstrap'
import CheckList from '../../../../../../common/components/ui/CheckList'
import OrderListFilter from './OrderFilter'

const TradeHistorySettings = ({checkData, handleCheckData}) => {
  const [activeSettingTab, setActiveSettingTab] = useState<string>('column')
  return (
    <Tabs
      defaultActiveKey={activeSettingTab}
      activeKey={activeSettingTab}
      transition={false}
      id='noanim-tab-example'
      className='mb-3 tw-w-[300px] dark:tw-border-b-slate-700'
      onSelect={(k: string | null, e: React.SyntheticEvent<unknown>) =>
        setActiveSettingTab(k ?? '')
      }
    >
      <Tab eventKey='column' title='Columns'>
        <ul className='tw-grid tw-grid-cols-2 tw-gap-2 p-0'>
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
