import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { SplitCol, SplitLayout, View, Root, Epic, ModalRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { useActiveVkuiLocation, usePopout, useRouteNavigator } from '@vkontakte/vk-mini-app-router';

import { Home } from './panels/Home';
import Persik from './panels/Persik';
import {
  ALTERNATIVE_ROOT,
  ALTERNATIVE_VIEW, ALTERNATIVE_VIEW_PANELS,
  DEFAULT_ROOT,
  DEFAULT_VIEW,
  DEFAULT_VIEW_PANELS,
  EMPTY_VIEW,
  EMPTY_VIEW_PANELS,
  HOME_PANEL_MODALS,
  PERSIK_PANEL_MODALS,
} from './routes';
import { Empty } from './panels/Empty';
import { PersikModal } from './modals/PersikModal';
import { UserModal } from './modals/UserModal';
import { Alternative } from './panels/Alternative';

function App() {
  const [fetchedUser, setUser] = useState<any>(null);
  const [popout, setPopout] = useState<JSX.Element | null>(null!);
  const routerPopout = usePopout();
  const routeNavigator = useRouteNavigator();
  const {
    root: activeRoot = DEFAULT_ROOT,
    view: activeView = DEFAULT_VIEW,
    panel: activePanel = DEFAULT_VIEW_PANELS.HOME,
    modal: activeModal,
    panelsHistory,
  } = useActiveVkuiLocation();

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);
  useEffect(() => {
    bridge.send('VKWebAppSetSwipeSettings', { history: !!panelsHistory?.length });
  }, [panelsHistory])

  const go = (path: string) => {
    console.log('go -> router.push', path);
    routeNavigator.push(path);
  };

  const modal = (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <PersikModal nav={PERSIK_PANEL_MODALS.PERSIK}></PersikModal>
      <UserModal nav={HOME_PANEL_MODALS.USER} fetchedUser={fetchedUser}></UserModal>
    </ModalRoot>
  );

  return (
    <SplitLayout popout={routerPopout || popout} modal={modal}>
      <SplitCol>
        <Epic activeStory={activeRoot}>
          <Root activeView={activeView} nav={DEFAULT_ROOT}>
            <View
              nav={DEFAULT_VIEW}
              history={panelsHistory}
              activePanel={activePanel}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Home nav={DEFAULT_VIEW_PANELS.HOME} fetchedUser={fetchedUser} go={go} />
              <Persik nav={DEFAULT_VIEW_PANELS.PERSIK} />
            </View>
            <View
              nav={EMPTY_VIEW}
              history={panelsHistory}
              activePanel={activePanel}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Empty nav={EMPTY_VIEW_PANELS.EMPTY} />
            </View>
          </Root>
          <Root activeView={activeView} nav={ALTERNATIVE_ROOT}>
            <View
              nav={ALTERNATIVE_VIEW}
              history={panelsHistory}
              activePanel={activePanel}
              onSwipeBack={() => routeNavigator.back()}
            >
              <Alternative nav={ALTERNATIVE_VIEW_PANELS.ALTERNATIVE} go={go} />
            </View>
          </Root>
        </Epic>
      </SplitCol>
    </SplitLayout>
  );
}

export default App;