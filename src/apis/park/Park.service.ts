import { injectable } from 'inversify';
import update from 'immutability-helper';

import { IParkService } from '@apis/park/Park.ioc';
import { INITIAL_PRICE, PER_HOUR, ONE_DAY_CHARGE, TPark, TParkingArea, TParkingRecord, TUnpark, MIN_HOURS } from './Park.data';

@injectable()
export default class ParkService implements IParkService {
  private parkingArea: TParkingArea;
  private parkingRecords: TParkingRecord[];

  constructor() {
    this.parkingArea = { entryPoints: 3, map: [], slotSizes: [], occupancy: [] };
    this.parkingRecords = [];
  }

  public setPark = (data: TParkingArea) => {
    this.parkingArea = { ...data };
    this.parkingRecords = [];
  };

  private calculateCharges = (data: Required<TParkingRecord>) => {
    const { parkDateTime, unparkDateTime, size } = data;
    const hours = Math.ceil((unparkDateTime.getTime() - parkDateTime.getTime())/3600000);
    const floatDays = hours / 24;
    if (floatDays > 1) {
      const extraHrs = Math.ceil((floatDays - Math.floor(floatDays)) * 24);
      const days = Math.floor(floatDays);
      return Math.ceil(days) * ONE_DAY_CHARGE + (extraHrs * PER_HOUR[size]);
    } else {
      return (hours - MIN_HOURS) * PER_HOUR[size] + INITIAL_PRICE;
    }
  }
  
  public park = (data: TPark) => {
    const { plateNumber, size } = data;
    
    if (this.parkingRecords.find(({ plateNumber: p }) => p === plateNumber))
      throw new Error('Existing Vehicle with the same plate number already parked here, please report to LTO.');
    /** Park vehicle if there is an available slot */
    if (!this.parkingArea.slotSizes.includes(size)) {
        throw new Error('Sorry, no available Parking Slot for the size of your vehicle.');
    }
    if (this.parkingArea.occupancy.length === 0 || this.parkingArea.occupancy.length < this.parkingArea.slotSizes.length) {
      const suitableSlots = this.parkingArea.map.map((c,i) => {
        const available = !(this.parkingArea.occupancy?.includes(i));
        const enoughSpace = this.parkingArea.slotSizes[i] >= data.size;
        if (available && enoughSpace) {
          return c;
        } else {
          return null;
        }
      });

      if (suitableSlots.reduce((a,b) => b == null ? a+1 : a, 0) == this.parkingArea.map.length) {
        throw new Error('Sorry, no available Parking Slot for the size of your vehicle.');
      }

      /** eslint-disable-next-line */
      const nearestDistance = suitableSlots.reduce((a,b) => {
        if (b) {
          const minB = Math.min(...b);
          return a < minB ? a : minB;
        } else {
          return a;
        }
      }, Infinity);

      const nearestAvailableSlot = suitableSlots.reduce((a,b,i) => {
        if (b && b.includes(nearestDistance)) a.push(i);
        return a;
      }, [] as Array<number | null>)[0];
      
      if (nearestAvailableSlot != null) {
        const parkSlot = {
          plateNumber,
          size: this.parkingArea.slotSizes[nearestAvailableSlot],
          slot: nearestAvailableSlot,
          parkDateTime: new Date(),
        };
  
        this.parkingRecords.push(parkSlot);
  
        this.parkingArea.occupancy.push(nearestAvailableSlot);
        return parkSlot;
      }
    }
    throw new Error('Sorry, no more available Parking Slot.');
  };
  
  public unpark = (data: TUnpark) => {
    const { plateNumber, currentDate: unparkDateTime } = data;
    const parkingRecord = this.parkingRecords.find(({ plateNumber: pN }) => pN === plateNumber);
    if (parkingRecord) {
      const price = this.calculateCharges({ ...parkingRecord, unparkDateTime });
      const indx = this.parkingRecords.findIndex(({ plateNumber: pN }) => pN === plateNumber);
      const occindx = this.parkingArea.occupancy.findIndex((occ) => occ === parkingRecord.slot);
      this.parkingArea.occupancy.splice(occindx, 1);
      
      return {
        ...this.parkingRecords.splice(indx, 1)[0],
        unparkDateTime,
        price
      }
    }

    throw new Error('Ghost Car Alert! A Car exited the parking complex that isn\'t exists in our records.')
  };
}
