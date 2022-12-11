export type RouteNameType = {
  commonName: string;
  naptanID: string;
};

export type RouteListItemType = {
  id: number;
  origin: RouteNameType;
  destination: RouteNameType;
};

export type RouteInformationType = {
  departureTimes: string[]; // timestamp
};

export type RouteListReducerDispatch = {
  type: string;
  route: RouteListItemType;
};

export type SideMenuStatus = ("closed" | "addRoute" | "about");
