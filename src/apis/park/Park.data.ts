export type TParkingMap = Array<number[]>;

export const INITIAL_PRICE: number = 40;

export const PER_HOUR: number[] = [20, 60, 100];

export const ONE_DAY_CHARGE: number = 5000;

export const MIN_HOURS = 3;

export type TSize = 0 | 1 | 2;

export type TPark = {
  plateNumber: string;
  size: TSize;
  currentDate: Date;
};

export type TUnpark = {
  plateNumber: string;
  currentDate: Date;
};

export type TParkSlot = {
  plateNumber: string;
  slot: number;
  parkDateTime: Date;
}

export type TUnParkSlot = {
  plateNumber: string;
  slot: number;
  price: number;
  unparkDateTime: Date;
}

export type TParkingArea = {
  entryPoints: number;
  map: TParkingMap;
  slotSizes: TSize[];
  occupancy: number[];
}

export type TParkingRecord = {
  plateNumber: string;
  size: TSize;
  slot: number;
  parkDateTime: Date;
  unparkDateTime?: Date;
}