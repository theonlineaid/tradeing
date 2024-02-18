import {RootState} from '#store/index'
import {has, map} from 'lodash'
import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {userTableColumns, userTableColumnsUpdate} from '../modules/auth/core/_requests'

function useInitTables({tableId}) {
  // console.log('render useInitTables')

  const {global, userData} = useSelector((state: RootState) => state)
  const updateField = async (id, body) => await userTableColumnsUpdate({id, body})
  
  const dispatch = useDispatch();

  let isDark = global.mode === 'dark'
  const [fields, setFields] = useState<any[]>([])

  const handleCheckData = (e: any, id: number) => {
    setFields((prevState) =>
      prevState.map((item) => {
        if (item.id === id) {
          const field = {...item, hide: !item.hide}
          updateField(id, field)
          return field
        } else {
          return item
        }
      })
    )
  }

  const cellStyles = {
    short_name: () => {
      return {fontWeight: 'bold'}
    },
    lpt: () => {
      return {
        color: isDark ? '#4bb2ff' : 'rgb(21 89 141)',
        textAlign: 'right',
      }
    },
    high: () => {
      return {textAlign: 'right'}
    },
    low: () => {
      return {textAlign: 'right'}
    },
    close: () => {
      return {textAlign: 'right'}
    },
    ycp: () => {
      return {textAlign: 'right'}
    },
    change: (params) => {
      const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#5ff2d0' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
    change_per: (params) => {
      const style = {color: '#888', textAlign: 'right', fontWeight: 'bold'}
      if (parseFloat(params.value) > 0) {
        return {...style, color: isDark ? '#5ff2d0' : 'green'}
      } else if (parseFloat(params.value) < 0) {
        return {...style, color: isDark ? '#CC0909' : 'red'}
      } else {
        return style
      }
    },
    value: () => {
      return {textAlign: 'right'}
    },
    volume: () => {
      return {textAlign: 'right'}
    },
    eps: () => {
      return {textAlign: 'right'}
    },
    floor_price: () => {
      return {textAlign: 'right'}
    },
    market_cap: () => {
      return {textAlign: 'right'}
    },
    audited_pe: () => {
      return {textAlign: 'right'}
    },
    authorized_cap: () => {
      return {textAlign: 'right'}
    },
    foreign: () => {
      return {textAlign: 'right'}
    },
    gov: () => {
      return {textAlign: 'right'}
    },
    institute: () => {
      return {textAlign: 'right'}
    },
    nav: () => {
      return {textAlign: 'right'}
    },
    nav_price: () => {
      return {textAlign: 'right'}
    },
    oci: () => {
      return {textAlign: 'right'}
    },
    open: () => {
      return {textAlign: 'right'}
    },
    open_cahnge_per: () => {
      return {textAlign: 'right'}
    },
    pe: () => {
      return {textAlign: 'right'}
    },
    paid_up_cap: () => {
      return {textAlign: 'right'}
    },
    public: () => {
      return {textAlign: 'right'}
    },
    q1eps: () => {
      return {textAlign: 'right'}
    },
    q2eps: () => {
      return {textAlign: 'right'}
    },
    q3eps: () => {
      return {textAlign: 'right'}
    },
    q4eps: () => {
      return {textAlign: 'right'}
    },
    reserve_surplus: () => {
      return {textAlign: 'right'}
    },
    spark_line: () => {
      return {textAlign: 'right'}
    },
    sponsor_director: () => {
      return {textAlign: 'right'}
    },
    total_securites: () => {
      return {textAlign: 'right'}
    },
    trade: () => {
      return {textAlign: 'right'}
    },
    un_audit_pe: () => {
      return {textAlign: 'right'}
    },
    v_change: () => {
      return {textAlign: 'right'}
    },
    vol_change_per: () => {
      return {textAlign: 'right'}
    },
    yvolume: () => {
      return {textAlign: 'right'}
    },
  }

  const updateTableData = (item) => {
    if (has(cellStyles, item.field)) {
      item['cellStyle'] = cellStyles[item.field]
    }
    return item
  }

  const fetchData = async () => {
    // const response = await userTableColumns({id:tableId, user:userData?.profile?.id ?? 0})
    
    const response = await userTableColumns({id: tableId, user: userData?.profile?.id ?? 0})
    const aa = response.data.table_user_data;
    let oldData = [...aa]
    oldData.map((item, i) => {
      if(item?.field === 'scrip')  { return (item.field = 'short_name') }
    })
    // console.log(oldData)
    
    setFields(map(oldData, updateTableData))
  }
  useEffect(() => {
    fetchData()
  }, [tableId])

  return {
    fields,
    handleCheckData,
  }
}

export default useInitTables
