import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {List} from './components/views'
import { updateMarketData } from '#store/slices/marketData'
import { useEffect } from 'react'
const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Credit',
    path: '/order/buy',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const TWS = () =>{ 
  return(
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='tws'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> TWS </PageTitle>
            <List />
          </>
        }
      />

      <Route index element={<Navigate to='/tws' />} />
    </Route>
  </Routes>
)}

export default TWS
