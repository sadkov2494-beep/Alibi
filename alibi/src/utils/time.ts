import { CaseData, Route, Suspect, TransportType } from '../types';

const travelKeyByTransport: Record<TransportType, keyof Route> = {
  walk: 'walkMinutes',
  car: 'carMinutes',
  bus: 'busMinutes',
  metro: 'metroMinutes',
  taxi: 'taxiMinutes',
};

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return hours * 60 + minutes;
};

export const minutesBetween = (startTime: string, endTime: string): number =>
  parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);

export const canTravelInTime = (startTime: string, endTime: string, travelMinutes: number): boolean =>
  minutesBetween(startTime, endTime) >= travelMinutes;

export const getRouteTravelTime = (
  fromLocationId: string,
  toLocationId: string,
  transportType: TransportType,
  routes: Route[],
): number | null => {
  const route = routes.find(
    (candidate) =>
      (candidate.from === fromLocationId && candidate.to === toLocationId) ||
      (candidate.from === toLocationId && candidate.to === fromLocationId),
  );

  if (!route) {
    return null;
  }

  const value = route[travelKeyByTransport[transportType]];
  return typeof value === 'number' ? value : null;
};

export const findLatestSuspectEventBeforeCrime = (suspect: Suspect, caseData: CaseData) => {
  const crimeMinutes = parseTimeToMinutes(caseData.crimeTime);

  return [...caseData.timelineEvents]
    .filter((event) => event.suspectId === suspect.id && parseTimeToMinutes(event.time) <= crimeMinutes)
    .sort((a, b) => parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time))[0];
};

export const canSuspectReachCrimeScene = (suspect: Suspect, caseData: CaseData): boolean => {
  const latestEvent = findLatestSuspectEventBeforeCrime(suspect, caseData);

  if (!latestEvent) {
    return false;
  }

  if (latestEvent.locationId === caseData.crimeLocationId) {
    return true;
  }

  return suspect.transport.some((transport) => {
    const travelTime = getRouteTravelTime(latestEvent.locationId, caseData.crimeLocationId, transport, caseData.routes);
    return travelTime !== null && canTravelInTime(latestEvent.time, caseData.crimeTime, travelTime);
  });
};
