import React from "react";
import {
  useNavigationBuilder,
  TabRouter,
  createNavigatorFactory,
} from "@react-navigation/native";
import { useSharedValue } from "react-native-reanimated";

import { TabNavigatorView } from "../views/TabNavigatorView";
import { Context } from "../utils/hooks";

function TabNavigator({
  id,
  initialRouteName,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  tabBar,
  tabBarPosition,
  tabBarStyle,
  contentStyle,
}) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(TabRouter, {
      id,
      initialRouteName,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
    });

  const scroll = useSharedValue<number>(0);

  return (
    <NavigationContent>
      <Context.Provider
        value={{
          scroll: scroll,
        }}
      >
        <TabNavigatorView
          state={state}
          navigation={navigation}
          descriptors={descriptors}
          screenOptions={screenOptions}
        />
      </Context.Provider>
    </NavigationContent>
  );
}

function createTabNavigator() {
  return createNavigatorFactory(TabNavigator)();
}

export { createTabNavigator };
