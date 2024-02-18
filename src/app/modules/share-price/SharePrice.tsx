import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Indices} from './components/Indices'
import {Indices_2} from './components/Indices_2'
import {NewOrder} from './components/SharePriceList'
import {ShareTradeList} from './components/Trade/ShareTradeList'

import AreaIndex from './components/TradeAreaChart/AreaIndex'
import Ticker from './components/NewsTicker/Ticker'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Share Price',
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

const Order = () => (
  <Routes>
    <Route
      element={
        <>
          <Outlet />
        </>
      }
    >
      <Route
        path='list'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Latest Share Price </PageTitle>
            <NewOrder />
          </>
        }
      />

      <Route
        path='indices'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Indices </PageTitle>
            <Indices />
          </>
        }
      />

      <Route
        path='indices_2'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Indices 2 </PageTitle>
            <Indices_2 />
          </>
        }
      />

      <Route
        path='trade-list'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Share Trade List dssfs </PageTitle>
            <ShareTradeList />
          </>
        }
      />
      <Route
        path='area-chart'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> Share Trade Area </PageTitle>
            <AreaIndex />
          </>
        }
      />
      <Route
        path='ticker'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}> NewsTicker </PageTitle>
            <Ticker />
          </>
        }
      />

      <Route index element={<Navigate to='/share-price/list' />} />
    </Route>
  </Routes>
)

export default Order
