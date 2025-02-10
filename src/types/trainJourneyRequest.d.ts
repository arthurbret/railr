interface Coord {
  lon: string;
  lat: string;
}

interface Link {
  type: string;
  id: string;
  name: string;
  types: string[];
}

interface StopPoint {
  id: string;
  name: string;
  label: string;
  coord: Coord;
  links: Link[];
  equipments: undefined[];
}

interface ApplicationPeriod {
  begin: string;
  end: string;
}

interface Severity {
  name: string;
  effect: string;
  color: string;
  priority: number;
}

interface Channel {
  content_type: string;
  id: string;
  name: string;
  types: string[];
}

interface Message {
  text: string;
  channel: Channel;
}

interface Trip {
  id: string;
  name: string;
}

interface PtObject {
  id: string;
  name: string;
  quality: number;
  trip: Trip;
  embedded_type: string;
}

interface ImpactedStop {
  stop_point: StopPoint;
  base_arrival_time: string;
  base_departure_time: string;
  amended_arrival_time: string;
  amended_departure_time: string;
  cause: string;
  stop_time_effect: string;
  departure_status: string;
  arrival_status: string;
  is_detour: boolean;
}

interface ImpactedObject {
  pt_object: PtObject;
  impacted_stops: ImpactedStop[];
}

export interface Disruption {
  id: string;
  disruption_id: string;
  impact_id: string;
  application_periods: ApplicationPeriod[];
  status: string;
  updated_at: string;
  cause: string;
  severity: Severity;
  messages: Message[];
  impacted_objects: ImpactedObject[];
  uri: string;
  disruption_uri: string;
  contributor: string;
}

interface FeedPublisher {
  id: string;
  name: string;
  url: string;
  license: string;
}

interface Pagination {
  total_result: number;
  start_page: number;
  items_per_page: number;
  items_on_page: number;
}

interface Context {
  current_datetime: string;
  timezone: string;
}

interface JourneyPattern {
  id: string;
  name: string;
}

export interface StopTime {
  arrival_time: string;
  utc_arrival_time: string;
  departure_time: string;
  utc_departure_time: string;
  headsign: string;
  stop_point: StopPoint;
  pickup_allowed: boolean;
  drop_off_allowed: boolean;
  skipped_stop: boolean;
}

interface Code {
  type: string;
  value: string;
}

interface ValidityPattern {
  beginning_date: string;
  days: string;
}

interface WeekPattern {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface ActivePeriod {
  begin: string;
  end: string;
}

interface Calendar {
  week_pattern: WeekPattern;
  active_periods: ActivePeriod[];
}

interface VehicleJourneyDisruption {
  templated: boolean;
  rel: string;
  internal: boolean;
  type: string;
  id: string;
}

interface VehicleJourney {
  id: string;
  name: string;
  journey_pattern: JourneyPattern;
  stop_times: StopTime[];
  codes: Code[];
  validity_pattern: ValidityPattern;
  calendars: Calendar[];
  trip: Trip;
  disruptions: VehicleJourneyDisruption[];
  headsign: string;
}

export interface JourneyApiResponse {
  pagination: Pagination;
  feed_publishers: FeedPublisher[];
  disruptions: Disruption[] | [];
  context: Context;
  vehicle_journeys: VehicleJourney[];
  links: Link[];
}