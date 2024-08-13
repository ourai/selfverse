import { type PropsWithChildren, type ReactNode } from 'react';
import { Spin } from 'antd';

import { useIdentityContext } from '../identity';
import style from './style.module.scss';

type VisitorOnlyProps = PropsWithChildren<{
  busy?: boolean;
}>;

function VisitorOnly(props: VisitorOnlyProps) {
  const identity = useIdentityContext();

  if (!identity.address) {
    return <div>Connect wallet first.</div>;
  }

  let resolvedChildren: ReactNode;

  if (identity.checked) {
    resolvedChildren = identity.visitor ? props.children : <div>You shouldn't be here.</div>;
  }

  return (
    <Spin wrapperClassName={style.VisitorOnly} spinning={props.busy || !identity.checked}>
      {resolvedChildren}
    </Spin>
  );
}

export default VisitorOnly;
