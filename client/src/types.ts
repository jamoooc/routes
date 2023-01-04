export type RouteNameType = {
  commonName: string;
  naptanID: string;
};

export type RouteListItemType = {
  id: number;
  selectedLine: LineDataType;
  selectedDirection: DirectionDataType;
  selectedStation: string;
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
