import { useLocation } from 'react-router-dom';

import type { IdentityProps } from './typing';
import { resolveContract } from './helper';
import { useIdentity } from './hook';
import IdentityContext from './Context';

function Identity(props: IdentityProps) {
  const { pathname } = useLocation();
  const identity = useIdentity(resolveContract(pathname));

  return (
    <IdentityContext.Provider value={identity}>
      {props.children}
    </IdentityContext.Provider>
  );
}

export default Identity;
