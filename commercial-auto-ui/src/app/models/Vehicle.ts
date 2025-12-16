export interface Vehicle {
  vehicleId: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  bodyType: VehicleBodyType;
  vehicleType: VehicleType;
  gvw: number;
  seatingCapacity?: number;
  costNew: number;
  currentValue: number;
  purchaseDate: Date;
  isLeased: boolean;
  primaryUse: VehicleUse;
  radiusOfOperation: RadiusOfOperation;
  annualMileage: number;
  garageAddress: Address;
  vehicleModifications?: string[];
  safetyFeatures: SafetyFeature[];
  antiTheftDevices: AntiTheftDevice[];
}

export enum VehicleBodyType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  PICKUP = 'PICKUP',
  VAN = 'VAN',
  CARGO_VAN = 'CARGO_VAN',
  BOX_TRUCK = 'BOX_TRUCK',
  FLATBED = 'FLATBED',
  DUMP_TRUCK = 'DUMP_TRUCK',
  TRACTOR = 'TRACTOR',
  TRAILER = 'TRAILER',
  REFRIGERATED_TRUCK = 'REFRIGERATED_TRUCK',
  TOW_TRUCK = 'TOW_TRUCK',
  OTHER = 'OTHER'
}

export enum VehicleType {
  PRIVATE_PASSENGER = 'PRIVATE_PASSENGER',
  LIGHT_TRUCK = 'LIGHT_TRUCK',
  MEDIUM_TRUCK = 'MEDIUM_TRUCK',
  HEAVY_TRUCK = 'HEAVY_TRUCK',
  EXTRA_HEAVY_TRUCK = 'EXTRA_HEAVY_TRUCK'
}

export enum VehicleUse {
  SERVICE = 'SERVICE',
  DELIVERY = 'DELIVERY',
  RETAIL = 'RETAIL',
  CONTRACTOR = 'CONTRACTOR',
  LONG_HAUL = 'LONG_HAUL',
  LOCAL_HAUL = 'LOCAL_HAUL',
  DUMP = 'DUMP',
  FOOD_TRANSPORT = 'FOOD_TRANSPORT',
  OTHER = 'OTHER'
}

export enum RadiusOfOperation {
  LOCAL_50 = 'LOCAL_50',
  INTERMEDIATE_51_200 = 'INTERMEDIATE_51_200',
  LONG_DISTANCE_201_500 = 'LONG_DISTANCE_201_500',
  LONG_DISTANCE_500_PLUS = 'LONG_DISTANCE_500_PLUS',
  NATIONWIDE = 'NATIONWIDE'
}

export interface SafetyFeature {
  type: SafetyFeatureType;
  description?: string;
}

export enum SafetyFeatureType {
  ABS_BRAKES = 'ABS_BRAKES',
  AIRBAGS = 'AIRBAGS',
  BACKUP_CAMERA = 'BACKUP_CAMERA',
  BLIND_SPOT_MONITORING = 'BLIND_SPOT_MONITORING',
  LANE_DEPARTURE_WARNING = 'LANE_DEPARTURE_WARNING',
  COLLISION_AVOIDANCE = 'COLLISION_AVOIDANCE',
  ELECTRONIC_STABILITY_CONTROL = 'ELECTRONIC_STABILITY_CONTROL',
  DASH_CAM = 'DASH_CAM'
}

export interface AntiTheftDevice {
  type: AntiTheftDeviceType;
  description?: string;
}

export enum AntiTheftDeviceType {
  ALARM = 'ALARM',
  GPS_TRACKING = 'GPS_TRACKING',
  IMMOBILIZER = 'IMMOBILIZER',
  STEERING_WHEEL_LOCK = 'STEERING_WHEEL_LOCK',
  VIN_ETCHING = 'VIN_ETCHING'
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
}
