import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
} from "react-native";
import DefaultTabBarView from "./DefaultTabBarView";
import { useHeaderHeight, useScrollProps } from "../utils/hooks";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useSharedValue,
  useDerivedValue,
  useAnimatedRef,
  scrollTo,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SCROLL_THRESHOLD = 0.2 * width;

import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

function TabNavigatorView({
  // tabBar = renderTabBarDefault,
  state,
  navigation,
  descriptors,
  contentStyle,
  screenOptions = {},
  ...rest
}) {
  const focusedOptions = descriptors[state.routes[state.index].key];

  const [headerHeight, getHeaderHeight] = useHeaderHeight();
  const { scroll } = useScrollProps();

  const scrollRef = useRef<ScrollView>(null);
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const horizontalScroll = useSharedValue<number>(0);
  const routes = useMemo(() => state.routes, [state.routes]);

  // useEffect(() => {
  //   const listenere = navigation.addListener("focus", (e) => {
  //     console.log('evt',e)
  //   })
  // }, []);

  useDerivedValue(() => {
    "worklet";
    scrollTo(animatedRef, 0, horizontalScroll.value * width, true);
  });

  const tabBar = ({ ...props }) => <BottomTabBar {...props} />;

  const renderBottomTabBar: React.FC = () => {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) =>
          tabBar({
            state: state,
            descriptors: descriptors,
            navigation: navigation,
            insets: {
              top: insets?.top ?? 0,
              right: insets?.right ?? 0,
              bottom: insets?.bottom ?? 0,
              left: insets?.left ?? 0,
            },
          })
        }
      </SafeAreaInsetsContext.Consumer>
    );
  };

  const scaleAnimationHeader = useAnimatedStyle(() => {
    "worklet";

    return {
      marginTop: interpolate(
        scroll.value,
        [0, SCROLL_THRESHOLD / 2],
        [0, -180],
        Extrapolation.CLAMP,
      ),
    };
  });

  const onTabPress = () => {};

  const handleScrollEvent = React.useCallback(
    (event: NativeScrollEvent) => {
      const totalOffsetX = Math.abs(event.nativeEvent.contentOffset.x);
      const pageOffsetX =
        totalOffsetX / width - Math.floor(totalOffsetX / width);
      const pageIndex = Math.round(totalOffsetX / width);
      const route = routes[pageIndex];

      if (Math.abs(pageOffsetX) > 0.4) navigation.jumpTo(route.name);
    },
    [routes, animatedRef],
  );

  useEffect(() => {
    animatedRef.current.scrollTo({
      x: state.index * width,
      y: 0,
      animated: true,
    });
  }, [state.index]);

  return (
    <React.Fragment>
      <Animated.View onLayout={getHeaderHeight}>
        {screenOptions.header &&
          screenOptions.header({
            initialHeaderHeight: headerHeight,
            ...focusedOptions,
          })}
      </Animated.View>
      {screenOptions.tabBarPosition === "top" && screenOptions.tabBar({state, descriptors, navigation, onTabPress})}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        ref={animatedRef}
        onScroll={handleScrollEvent}
        scrollEventThrottle={16}
      >
        {routes.map((route, i) => {
          return (
            <View key={route.key} style={{ width }}>
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </Animated.ScrollView>
      {screenOptions.tabBarPosition === "bottom" && renderBottomTabBar()}
      {/* {screenOptions.tabBarPosition === "bottom" && screenOptions.tabBar({state, descriptors, navigation, onTabPress})} */}
    </React.Fragment>
  );
}

export { TabNavigatorView };
