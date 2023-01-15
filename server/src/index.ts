import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import type {
  TubeLineType,
  RouteSectionType,
  RouteStopPointType,
  DepartureTimeType
} from './types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173' }));

const init: RequestInit = {
  method: "GET",
  headers: {
    api_key: process.env.TFL_API_KEY || ""
  }
}

// utility fetch wrapper

async function fetchData<T>(url: string, init?: RequestInit): Promise<T> {
  return await fetch(url, init)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>
    })
    .then((data) => data)
    .catch((e) => {
      throw e;
    });
}


// get line name and IDs for the given mode
app.get('/lines', async (req: Request, res: Response) => {

  const mode = req.query?.mode;
  if (!mode) {
    console.error('Invalid mode');
    return res.sendStatus(400);
  }

  const url = `https://api.tfl.gov.uk/Line/Mode/${mode}`;
  const data = await fetchData<TubeLineType[]>(url, init)
    .catch((e) => console.error(e));

  return data ? res.json(data) : res.sendStatus(500);
});


// get the available route options for the given line ID
app.get('/routes', async (req: Request, res: Response) => {

  const lineID = req.query?.lineID;
  if (!lineID) {
    console.error('Invalid lineID');
    return res.sendStatus(400);
  }

  const url = `https://api.tfl.gov.uk/Line/${lineID}/Route`;
  const data = await fetchData<{ routeSections: RouteSectionType[] }>(url, init)
    .catch((e) => console.error(e));

  if (!data || !data.routeSections.length) {
    return res.sendStatus(500);
  }

  // NOTE: routeSections may contain expired, or not yet valid, routes.
  const now = new Date().getTime();
  const routeSections = data.routeSections
    .filter((route: RouteSectionType) => (
      new Date(route.validFrom).getTime() < now &&
      new Date(route.validTo).getTime() > now
    ))
    .reduce((a: RouteSectionType[], c: RouteSectionType) => (
      a.findIndex(e => e.name === c.name) > -1 ? a : [...a, c]
    ), []);

  return routeSections ? res.json(routeSections) : res.sendStatus(500);
});


// get possible departure stations for the given line ID and direction
app.get('/route-stoppoints', async (req: Request, res: Response) => {

  const lineID = req.query?.lineID;
  const direction = req.query?.direction;

  if (!lineID || !direction) {
    console.error('Invalid lineID or direction');
    return;
  }

  const url = `https://api.tfl.gov.uk/Line/${lineID}/Route/Sequence/${direction}`;
  const data = await fetchData<RouteStopPointType>(url, init)
    .catch((e) => console.error(e));

  if (!data) {
    console.error('Invalid direction');
    return;
  }

  let routeStoppoints;
  // TODO: This filters out hubs excluding a significant number of stations
  routeStoppoints = data.stations.filter(
    (station: { stationId: string }) => {
      let r;
      // TODO: orderedLineRoutes are grouped by route, select the correct
      // one or merge them to get all stations for the line
      if (data.orderedLineRoutes[0].naptanIds.includes(station.stationId)) {
        r = data.orderedLineRoutes[0].naptanIds.includes(station.stationId);
      }
      return r;
    }
  );

  return routeStoppoints ? res.json(routeStoppoints) : res.sendStatus(500);
});


// get departure time for the given direction and departure station
app.get('/departures', async (req: Request, res: Response) => {

  const departureNaptanID = req.query?.departureNaptanID;
  const requestedDirection = req.query?.direction;

  if (!departureNaptanID || !requestedDirection) {
    console.log("Invalid departureNaptanID or requestedDirection");
    return;
  }

  const url = `https://api.tfl.gov.uk/StopPoint/${departureNaptanID}/Arrivals`;
  const data = await fetchData<DepartureTimeType[]>(url, init)
    .catch((e) => console.error(e));

  if (!data) {
    return res.sendStatus(500);
  };

  const departures = data
    .map((departureTime: DepartureTimeType) => ({
      ...departureTime
    }))
    .filter(({ direction }: { direction: string }) => (
      direction === requestedDirection
    ))
    .sort((a: DepartureTimeType, b: DepartureTimeType) => (
      new Date(a.expectedArrival).getTime() < new Date(b.expectedArrival).getTime() ? -1 : 1
    ));

  return departures ? res.json(departures) : res.sendStatus(500);
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
