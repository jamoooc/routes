export type RouteNameType = {
  commonName: string;
  naptanID: string;
};

export type RouteListItemType = {
  id: number;
  selectedLine: string;
  selectedDirection: string;
  selectedStation: string;
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

export type LineDataType = {
  name: string;
  id: string;
};

export type StationDataType = {
  name: string;
  id: string;
};

export type DirectionDataType = {
  name: string;
  direction: string;
  originator: string;
  originationName: string;
  destination: string;
  destinationName: string;
};
