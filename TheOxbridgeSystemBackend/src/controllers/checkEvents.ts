import date from "date-and-time";
import {EventModel, IEvent} from "../models/event";
import {EventRegistrationModel, IEventRegistration} from "../models/eventRegistration";
import {IShip, ShipModel} from "../models/ship";
import nodemailer from "nodemailer";

/**
 * Helper method to not blow the server class harder.
 * Called once in the start and running in the background to check once every day,
 * if a notification should be sent to the participant.
 * @param boolean - true if 3 days before event.
 */
export const timerForTheReminder = async (): Promise<any> => {
    try {
        const now = new Date();
        const currentTime = date.format(now, "YYYY/MM/DD HH");
        const events: IEvent[] = await EventModel.find({});
        await events.forEach(async (event: IEvent) => {
            const reminderDate = date.addDays(event.eventStart, -3);
            const minusHours = date.addHours(reminderDate, -2);
            const eventDate = date.format(minusHours, "YYYY/MM/DD HH");
            if (eventDate === currentTime) {
                const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({eventId: event.eventId});
                eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {
                    const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId});
                    // Transporter object using SMTP transport
                    if (eventRegistration.mailRecieved === false) {
                        const transporter = nodemailer.createTransport({
                            host: "smtp.office365.com",
                            port: 587,
                            secure: false,
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PSW,
                            },
                        });
                     // sending mail with defined transport object
                        const info = await transporter.sendMail({
                            from: '"Treggata" <aljo0025@easv365.dk>',
                            to: ship.emailUsername,
                            subject: "Event Reminder: Your event is due in 3 days.",
                            text: "You shall be on the following event in 3 days: " + event.name + "." + "Make sure to be there on time :)", // text body
                        });
                        eventRegistration.mailRecieved = true;
                        eventRegistration.save();
                    }
                });
            }
        })
        return true;
    }catch(e) {
        return false;
    }
}
const twentyfourHoursInMS: number = 86400000;
const oneMinuteinMSForThePresentation: number = 30000;
setInterval(timerForTheReminder, twentyfourHoursInMS);
