interface Pagination {
  total_result: number;
  start_page: number;
  items_per_page: number;
  items_on_page: number;
}

interface FeedPublisher {
  id: string;
  name: string;
  url: string;
  license: string;
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

interface PtObject {
  id: string;
  name: string;
  quality: number;
  trip: Trip;
  embedded_type: string;
}

interface Trip {
  id: string;
  name: string;
}

interface Disruption {
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

interface Context {
  current_datetime: string;
  timezone: string;
}

interface Coord {
  lon: string;
  lat: string;
}

interface Link {
  type: string;
  id: string;
}

interface StopPoint {
  id: string;
  name: string;
  label: string;
  coord: Coord;
  links: Link[];
  physical_modes: PhysicalMode[];
}

export interface StopArea {
  id: string;
  name: string;
  codes: Code[];
  timezone: string;
  label: string;
  coord: Coord;
  links: Link[];
  administrative_regions: AdministrativeRegion[];
}

interface Code {
  type: string;
  value: string;
}

interface AdministrativeRegion {
  id: string;
  name: string;
  level: number;
  zip_code: string;
  label: string;
  insee: string;
  coord: Coord;
}

interface PhysicalMode {
  id: string;
  name: string;
  co2_emission_rate?: Co2EmissionRate;
}

interface Co2EmissionRate {
  value: number;
  unit: string;
}

interface CommercialMode {
  id: string;
  name: string;
}

interface Geojson {
  type: string;
  coordinates: undefined[];
}

interface Line {
  id: string;
  name: string;
  code: string;
  color: string;
  text_color: string;
  codes: string[];
  physical_modes: PhysicalMode[];
  commercial_mode: CommercialMode;
  network: Network;
  opening_time: string;
  closing_time: string;
  geojson: Geojson;
  links: Link[];
}

interface Network {
  id: string;
  name: string;
  links: Link[];
}

interface Route {
  id: string;
  name: string;
  is_frequence: string;
  direction_type: string;
  physical_modes: PhysicalMode[];
  direction: Direction;
  geojson: Geojson;
  links: Link[];
  line: Line;
}

interface Direction {
  id: string;
  name: string;
  quality: number;
  stop_area: StopArea;
  embedded_type: string;
}

interface StopDateTime {
  departure_date_time: string;
  base_departure_date_time: string;
  arrival_date_time: string;
  base_arrival_date_time: string;
  additional_informations: undefined[];
  links: Link[];
  data_freshness: string;
}

interface DisplayInformation {
  commercial_mode: string;
  network: string;
  direction: string;
  label: string;
  color: string;
  code: string;
  headsign: string;
  name: string;
  links: Link[];
  text_color: string;
  trip_short_name: string;
  description: string;
  physical_mode: string;
  equipments: undefined[];
}

export interface Departure {
  route: Route;
  stop_point: StopPoint;
  stop_date_time: StopDateTime;
  display_informations: DisplayInformation;
  links: Link[];
}

export interface DeparturesApiResponse {
  pagination: Pagination;
  feed_publishers: FeedPublisher[];
  disruptions: Disruption[];
  context: Context;
  departures: Departure[];
  links: Link[];
  notes: undefined[];
  exceptions: undefined[];
}

// TODO : merge with DepartureApiResponse