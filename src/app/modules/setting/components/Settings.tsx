import {RootState} from '#store/index'
import {setSystemAllTableLists} from '#store/slices/globalSlice'
import {useEffect, useState} from 'react'
import {Tab, Tabs} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {systemAllTableLists} from '../../auth/core/_requests'

const Settings = () => {
  const dispatch = useDispatch()
  const {global, theme} = useSelector((state: RootState) => state)

  const [activeTab, setActiveTab] = useState<string>('add_table')

  const handleCreateNewTableWithLayout = (id) => {
    console.log(id, theme.selectedTheme)
  }

  // set system all table to redux
  useEffect(() => {
    ;(async () => {
      // API call
      const {data} = await systemAllTableLists()

      // dispatch data
      dispatch(setSystemAllTableLists(data?.data))
    })()
  }, [])

  return (
    <Tabs
      defaultActiveKey={activeTab}
      activeKey={activeTab}
      transition={false}
      id='noanim-tab-example'
      className='mb-3 tw-w-[500px] dark:tw-border-b-slate-700'
      onSelect={(k: string | null, e: React.SyntheticEvent<unknown>) => setActiveTab(k ?? '')}
    >
      <Tab eventKey='add_table' title='Add Table' className='dark:tw-text-slate-400'>
        <div className='tw-px-5'>
          <h2 className='tw-block tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white'>
            Add New Table
          </h2>
          <div className='tw-w-4/5 mt-2'>
            <table className='border-collapse border border-slate-500 tw-w-full tw-table-auto'>
              <thead>
                <tr>
                  <th className='border border-slate-600 tw-ml tw-px-5 tw-py-2 tw-text-center'>
                    #SL
                  </th>
                  <th className='border border-slate-600 tw-ml tw-px-5 tw-py-2'>Name</th>
                  <th className='border border-slate-600 tw-ml tw-px-5 tw-py-2 tw-text-center'>
                    Action
                  </th>
                  <th className='border border-slate-600 tw-ml tw-px-5 tw-py-2 tw-text-center'>
                    Existing
                  </th>
                </tr>
              </thead>
              <tbody>
                {global?.systemAllTable?.map((t, i) => {
                  const {id, name, code, view_type, table_type} = t
                  return (
                    <tr key={id}>
                      <td className='border border-slate-700 tw-w-1/12 tw-px-5 tw-text-center'>
                        {i + 1}
                      </td>
                      <td className='border border-slate-700 tw-w-7/12 tw-px-5'>{name}</td>
                      <td className='border border-slate-700 tw-w-2/12 tw-py-2 tw-text-center'>
                        <button className='btn custom-btn tw-px-5 dark:tw-text-slate-100 tw-bg-gradient-to-r tw-from-blue-400 tw-to-red-400 dark:tw-bg-gradient-to-r dark:tw-from-purple-900 dark:tw-to-purple-700 dark:tw-border-[#3b6d61] dark:tw-shadow-slate-500 text-white text-sm tw-p-1'>
                          Add
                        </button>
                      </td>
                      <td className='border border-slate-700 tw-w-2/12 tw-px-5 tw-text-center'>
                        {id}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Tab>
      <Tab eventKey='tab_one' title='Tab One' className='dark:tw-text-slate-400'>
        <h2>Tab One Settings</h2>
      </Tab>
      <Tab eventKey='tab_two' title='Tab Two' className='dark:tw-text-slate-400'>
        <h2>Tab Two Settings</h2>
      </Tab>
    </Tabs>
  )
}

export default Settings
