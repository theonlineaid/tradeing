import {NewsDataProvider} from '#context/newsContext'
import {FC, lazy, PropsWithChildren, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import TopBarProgress from 'react-topbar-progress-indicator'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import BlotterDataProvider from '../context/blotterDataContext'
import Compose from '../context/compose'
import FixSocketContext from '../context/fixSocketContext'
import MarketDataProvider from '../context/marketDataContext'
import {List} from '../modules/tws/components/views'

const PrivateRoutes = () => {
  const InputPage = lazy(() => import('../modules/bo-account/ProfilePage'))
  const OrderPage = lazy(() => import('../modules/order/Order'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const SharePrice = lazy(() => import('../modules/share-price/SharePrice'))
  const Settings = lazy(() => import('../modules/setting/SettingsPanel'))
  const CreditPanel = lazy(() => import('../modules/credit-panel/CreditPanel'))
  const TWS = lazy(() => import('../modules/tws/TWS'))

  return (
    <Routes>
      <Route element={<MarketDataProvider><MasterLayout /></MarketDataProvider>}>
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        {/* TODO: Redux for blotter */}
        <Route
          path='dashboard'
          element={
            <Compose
              components={[
                MarketDataProvider,
                BlotterDataProvider,
                FixSocketContext,
                NewsDataProvider,
              ]}
            >
              <List />
            </Compose>
          }
          // <Route path='dashboard' element={<Compose components={[MarketDataProvider, BlotterDataProvider]}><List /></Compose>}
        />
        <Route path='settings/*' element={<Settings />} />
        {/* Lazy Modules */}
        <Route
          path='profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='bo-account/input/*'
          element={
            <SuspensedView>
              <InputPage />
            </SuspensedView>
          }
        />

        <Route
          path='order/*'
          element={
            <SuspensedView>
              <OrderPage />
            </SuspensedView>
          }
        />

        <Route
          path='share-price/*'
          element={
            <SuspensedView>
              <SharePrice />
            </SuspensedView>
          }
        />

        <Route
          path='credit-panel/*'
          element={
            <SuspensedView>
              <CreditPanel />
            </SuspensedView>
          }
        />

        <Route
          path='tws/*'
          element={
            <SuspensedView>
              <TWS />
            </SuspensedView>
          }
        />

        <Route path='settings' element={<List />} />

        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<PropsWithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
