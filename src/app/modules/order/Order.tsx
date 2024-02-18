import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core' 
import {NewOrder} from './components/NewOrder'
import {UserTrades} from './components/UserTrades'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Order',
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
        path='buy'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Order Buy & Sell </PageTitle>
            <NewOrder />
          </>
        }
      />

      <Route
        path='trades'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>User Trades </PageTitle>
            <UserTrades />
          </>
        }
      />

      <Route index element={<Navigate to='/order/buy' />} />
    </Route>
  </Routes>
)

export default Order
