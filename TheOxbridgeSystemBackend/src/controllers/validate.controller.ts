import express from 'express';
import {EventModel, IEvent} from "../models/event";
import {EventRegistrationModel, IEventRegistration} from '../models/eventRegistration'
import {IShip, ShipModel} from '../models/ship'
import {ILocationRegistration, LocationRegistrationModel} from '../models/locationRegistration'
import {IRacePoint, RacePointModel} from '../models/racePoint'


/**
 * Validating the different parts of the program
 */
export class Validate {

    /**
     * Autom increments the eventRegistration and works both as validator and saver to the DB
     * @param
     */
    static async createRegistration(newRegistration: IEventRegistration, res: express.Response): Promise<IEventRegistration> {

        const lastEventRegistration: IEventRegistration = await EventRegistrationModel.findOne({}, {},{sort:{regId: -1}});
        const one: any = 1;
        if (lastEventRegistration)
            newRegistration.eventRegId = lastEventRegistration.eventRegId + one;
        else
            newRegistration.eventRegId = 1;

        await newRegistration.save();
        return newRegistration;
    }


    /**
     * Helper method to create the different checkpoint
     * @param result The distance between two points.
     */
    static FindDistance(registration: any, racePoint: any): any {
        const checkPoint1 = {
            longtitude: Number,
            latitude: Number
        };
        const checkPoint2 = {
            longtitude: Number,
            latitude: Number
        };

        checkPoint1.longtitude = racePoint.firstLongtitude;
        checkPoint1.latitude = racePoint.firstLatitude;
        checkPoint2.longtitude = racePoint.secondLongtitude;
        checkPoint2.latitude = racePoint.secondLatitude;

        const AB: any = Validate.CalculateDistance(checkPoint1, checkPoint2);
        const BC: any = Validate.CalculateDistance(checkPoint2, registration);
        const AC: any = Validate.CalculateDistance(checkPoint1, registration);

        const P: number = (AB + BC + AC) / 2;
        const S: number = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));

        const result = 2 * S / AB;
        return result
    }

    /**
     * Helper method for the FindDistance() function
     * Calculates the distance based on meters.
     * @param d is the distance.
     */

    static CalculateDistance(checkPoint1: { longtitude: any; latitude: any; }, checkPoint2: { longtitude: any; latitude: any; }): number {
        const R = 6371e3; // metres
        const ??1 = checkPoint1.latitude * Math.PI / 180; // ??, ?? in radians
        const ??2 = checkPoint2.latitude * Math.PI / 180;
        const ???? = (checkPoint2.latitude - checkPoint1.latitude) * Math.PI / 180;
        const ???? = (checkPoint2.longtitude - checkPoint1.longtitude) * Math.PI / 180;

        const a = Math.sin(???? / 2) * Math.sin(???? / 2) +
            Math.cos(??1) * Math.cos(??2) *
            Math.sin(???? / 2) * Math.sin(???? / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // noinspection UnnecessaryLocalVariableJS
        const d = R * c;

        return d;
    }

    /**
     * Checking if eventReg exists
     * @param
     */
    static async validateLocationForeignKeys(registration: ILocationRegistration, res: express.Response): Promise<boolean> {
        const eventReg: IEventRegistration = await EventRegistrationModel.findOne({eventRegId: registration.eventRegId});
        if (!eventReg) {
            return false;
        }
        return true;

    }


    /**
     *Checks which racepoint the ship has reached last
     * @param updatedRegistration the registration with racePoints - Score & Finsih Time.
     */
    static async CheckRacePoint(registration: ILocationRegistration, res: express.Response): Promise<any> {
        const eventRegistration: IEventRegistration = await EventRegistrationModel.findOne({eventRegId: registration.eventRegId}, {
            _id: 0,
            __v: 0
        });
        let nextRacePointNumber = 2;
        const one: any = 1;
        const locationRegistration: ILocationRegistration = await LocationRegistrationModel.findOne({eventRegId: registration.eventRegId}, {
            _id: 0,
            __v: 0
        }, {sort: {'locationTime': -1}});
        if (locationRegistration) {
            nextRacePointNumber = locationRegistration.racePointNumber + one;
            if (locationRegistration.finishTime != null) {
                const updatedRegistration = registration;
                updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                updatedRegistration.raceScore = locationRegistration.raceScore;
                updatedRegistration.finishTime = locationRegistration.finishTime;
                return updatedRegistration;
            }
        }

        if (eventRegistration) {
            const event: IEvent = await EventModel.findOne({eventId: eventRegistration.eventId}, {_id: 0, __v: 0});
            if (event && event.isLive) {

                // Finds the next racepoint and calculates the ships distance to the racepoint
                // and calculates the score based on the distance
                const nextRacePoint: IRacePoint = await RacePointModel.findOne({
                    eventId: eventRegistration.eventId,
                    racePointNumber: nextRacePointNumber
                }, {_id: 0, __v: 0});
                if (nextRacePoint) {
                    let distance: any = this.FindDistance(registration, nextRacePoint);
                    if (distance < 25) {

                        if (nextRacePoint.type !== "finishLine") {
                            const newNextRacePoint: IRacePoint = await RacePointModel.findOne({
                                eventId: eventRegistration.eventId,
                                racePointNumber: nextRacePoint.racePointNumber + one
                            }, {_id: 0, __v: 0});


                            if (newNextRacePoint) {
                                const nextPointDistance: any = this.FindDistance(registration, newNextRacePoint);
                                distance = nextPointDistance;

                                const updatedRegistration = registration;
                                updatedRegistration.racePointNumber = nextRacePointNumber;
                                updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                                return updatedRegistration;


                            }
                        } else {
                            const updatedRegistration = registration;
                            updatedRegistration.racePointNumber = nextRacePointNumber;
                            updatedRegistration.finishTime = registration.locationTime
                            const ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                            updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000
                            return updatedRegistration;
                        }
                    } else {
                        const updatedRegistration = registration;
                        updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                        updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                        return updatedRegistration;
                    }

                } else {
                    const updatedRegistration = registration;
                    updatedRegistration.racePointNumber = 1;
                    updatedRegistration.raceScore = 0;
                    return updatedRegistration;

                }
            } else {
                const updatedRegistration = registration;
                updatedRegistration.racePointNumber = 1;
                updatedRegistration.raceScore = 0;
                return updatedRegistration;
            }

        }
    }


}
