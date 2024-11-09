import { useContext, useState, useCallback, createContext } from "react";
import { useAnimatedScrollHandler } from "react-native-reanimated";

import { type NativeScrollEvent, type LayoutChangeEvent } from "react-native";
import { type TopTabsContext } from "../types/context";

// import { Context } from "./context";
export const Context = createContext<TopTabsContext | undefined>(undefined);

const useTabsContext = (): TopTabsContext => {
  const context = useContext(Context);
  if (!context) throw Error("Expo-Router-Top-Tabs: no Context found");

  return context;
};

export const useScrollProps = () => {
  const context = useTabsContext();
  const scroll = context.scroll;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event: NativeScrollEvent) => {
      "worklet";

      scroll.value = event.contentOffset.y;

      // if (!isNaN(event.contentOffset.y)) scroll.value = event.contentOffset.y;
    },
  });

  return { onScroll, scroll };
};

export function useHeaderHeight() {
  const [height, setHeight] = useState(0);

  const getHeight = useCallback(
    (event: LayoutChangeEvent) => {
      const { height: _height } = event.nativeEvent.layout;

      if (_height !== height) {
        setHeight(_height);
      }
    },
    [height, setHeight],
  );
  return [height, getHeight] as const;
}
