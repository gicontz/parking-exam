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

  private getDiffHours = (d1: Date, d2: Date) => Math.ceil((d1.getTime() - d2.getTime())/3600000)

  private calculateCharges = (data: Required<TParkingRecord>) => {
    const { parkDateTime, unparkDateTime, size } = data;
    const hours = this.getDiffHours(unparkDateTime, parkDateTime);
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
    const { plateNumber, size, currentDate } = data;
    const parkInfo = this.parkingRecords.find(({ plateNumber: p }) => p === plateNumber);
    const parkInfoIndex = this.parkingRecords.findIndex(({ plateNumber: p }) => p === plateNumber);
    let properParkDateTime = currentDate;
    
    if (parkInfo) {
      if ('unparkDateTime' in parkInfo == false) {
        throw new Error('Vehicle does not leave this parking complex yet');
      }

      if (currentDate.getTime() < (parkInfo.unparkDateTime as Date).getTime()) {
        throw new Error('Current Date should be in the future');
      }
      
      // if Car went back and still available
      if (!this.parkingArea.occupancy.includes(parkInfo.slot)) {
        if (parkInfo.unparkDateTime && this.getDiffHours(currentDate, parkInfo.unparkDateTime) == 1) {
          delete parkInfo.unparkDateTime;
          return {
            ...parkInfo,
          };
        } else {
          // Remove if the car went back beyond an hour - to procee on new parking record
          this.parkingRecords.splice(parkInfoIndex, 1);
        }
      } else {
        // If no longer available, prepare it's original parking DateTime
        properParkDateTime = parkInfo.parkDateTime;
      }
    }
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
          parkDateTime: properParkDateTime,
        };
  
        if (!parkInfo) {
          this.parkingRecords.push(parkSlot);
        } else {
          this.parkingRecords = update(this.parkingRecords, {
            [parkInfoIndex]: {
              $merge: {
                slot: nearestAvailableSlot,
                parkDateTime: properParkDateTime,
                size: this.parkingArea.slotSizes[nearestAvailableSlot],
              }
            }
          })
        }
  
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

      this.parkingRecords = update(this.parkingRecords, {
        [indx]: { $merge: { unparkDateTime } },
      });

      return {
        ...parkingRecord,
        unparkDateTime,
        price
      }
    }

    throw new Error('Ghost Car Alert! A Car exited the parking complex that isn\'t exists in our records.')
  };
}
