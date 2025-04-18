import { memo } from "react";
import DefaultLayout from "./Default";
import EmptyLayout from "./Empty";

const LayoutTypesMapping = {
  DefaultLayout,
  EmptyLayout,
};

const defaultLayoutType = "DefaultLayout";

const Layout = ({ asLayout = defaultLayoutType, children, ...rest }) => {
  const LayoutType = LayoutTypesMapping[asLayout];
  console.log(window.location.pathname);
  if (window.location.pathname.includes("/edit-video")) {
    return <LayoutType withSideBar={false}>{children}</LayoutType>;
  }
  return <LayoutType {...rest}>{children}</LayoutType>;
};

export default memo(Layout);
