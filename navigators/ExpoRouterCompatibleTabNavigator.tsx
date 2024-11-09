import React, { type ReactNode } from "react";

import { Navigator } from "expo-router";
import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";
import { useContextKey } from "expo-router/build/Route";
import { useSortedScreens } from "expo-router/build/useScreens";

import { createTabNavigator } from "../navigators/createTabNavigator";

import { Context } from "../utils/context";

const Tab = createTabNavigator().Navigator;

type TopTabsProps = {
  children: ReactNode;
  options?: object;
  header?: ReactNode;
  tabBar?: ReactNode;
  tabBarPosition?: "top" | "bottom";
};

const ExpoRouterCompatibleTabNavigator: React.FC<TopTabsProps> = ({
  children,
  options,
  header,
  tabBarPosition = "top",
  ...props
}) => {
  const { screens } = useFilterScreenChildren(children, {
    isCustomNavigator: true,
  });

  const contextKey = useContextKey();
  const sorted = useSortedScreens(screens ?? []);

  if (!sorted.length) {
    console.warn(`Layout at "${contextKey}" has no children.`);
    return null;
  }

  return (
    <Tab
      {...props}
      initialRouteName="favorites"
      children={sorted}
      // screenOptions={options}
      tabBarPosition={tabBarPosition}
    />
  );
};

ExpoRouterCompatibleTabNavigator.Screen = Navigator.Screen;

export { ExpoRouterCompatibleTabNavigator };
