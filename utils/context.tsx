import { createContext } from "react";

import { type TopTabsContext } from "../types/context";

// should move this elsewhere
const Context = createContext<TopTabsContext | undefined>(undefined);

export { Context };
