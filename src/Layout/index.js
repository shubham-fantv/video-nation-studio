
import { memo } from 'react'
import DefaultLayout from './Default'
import EmptyLayout from './Empty'
import { ContextProvider } from '../context/WalletContext'
const LayoutTypesMapping = {
  DefaultLayout,
  EmptyLayout,
}

const defaultLayoutType = 'DefaultLayout'

const Layout = ({ asLayout = defaultLayoutType, children, ...rest }) => {
  const LayoutType = LayoutTypesMapping[asLayout]
  const path = window.location.pathname

  const inner = path.includes('/edit-video') ? (
    <LayoutType withSideBar={false}>{children}</LayoutType>
  ) : (
    <LayoutType {...rest}>{children}</LayoutType>
  )

  // pass the real browser cookies into your ContextProvider
  return (
    <ContextProvider cookies={document.cookie}>
      {inner}
    </ContextProvider>
  )
}

export default memo(Layout)
