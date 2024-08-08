import { createContext } from 'react';

import { getDefaultIdentity } from './helper';

export default createContext(getDefaultIdentity());
