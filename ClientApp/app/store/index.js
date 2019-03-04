import { localizeReducer } from 'react-localize-redux';

import * as AuthStore from './AuthStore';
import * as ProgramStore from './ProgramStore';
import * as UserStore from './UserStore';
import * as PageSettingStore from './PageSettingStore';
import * as ModalStore from './ModalStore';

export const reducers = {
    localize: localizeReducer,
    auth: AuthStore.reducer,
    programStore: ProgramStore.reducer,
    user: UserStore.reducer,
    pageSettings: PageSettingStore.reducer,
    modal: ModalStore.reducer,
};

export default reducers;
