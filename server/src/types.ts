export type TubeLineType = {
  id: string,
  name: string,
}

export type RouteDirectionType = ('inbound' | 'outbound');

export type RouteSectionType = {
  name: string;
  direction: RouteDirectionType;
  originationName: string;
  destinationName: string;
  originator: string;
  destination: string;
  serviceType: string;
  validTo: string,
  validFrom: string
};

export type OrderedLineRouteType = {
  name: string;
  naptanIds: string[];
  serviceType: string; // TODO: regular | night
}

export type StationInformationType = {
  stationId: string;
  name: string;
}

export type RouteStopPointType = {
  stations: StationInformationType[];
  orderedLineRoutes: OrderedLineRouteType[];
};

export type DepartureTimeType = {
  direction: string;
  destinationNaptanId: string;
  destinationName: string;
  expectedArrival: string;
  towards: string;
  timeToStation: number;
};
