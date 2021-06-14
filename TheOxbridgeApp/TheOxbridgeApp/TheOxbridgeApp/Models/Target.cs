﻿using System;

namespace TheOxbridgeApp.Models
{
    public static class Target
    {
        private const String azure = "http://192.168.87.121:3000/";

        private const String StandardAdress = azure;


        public const String Authenticate = StandardAdress + "users/login";
        public const String Events = StandardAdress + "events/";
        public const String GetAllEventReg = StandardAdress + "eventRegistrations/";
        public const String GetImages = StandardAdress + "eventRegistrations/getParticipants/";


        public const String MessageFromEmailUsername = StandardAdress + "broadcastget/";
        public const String ForgotPassword = StandardAdress + "users/forgot/";

        public const String PutImages = StandardAdress + "eventRegistrations/updateParticipant/";

        public const String EventsFromUsername = StandardAdress + "events/myevents/findFromUsername";
        public const String EventRegistrations = StandardAdress + "eventregistrations/findEventRegFromUsername/";
        public const String Locations = StandardAdress + "locationRegistrations/";
        public const String StartAndFinishPoints = StandardAdress + "racepoints/findStartAndFinish/";
        public const String LiveLocations = StandardAdress + "locationRegistrations/getlive/";
        public const String ReplayLocations = StandardAdress + "locationRegistrations/getReplay/";
        public const String Ships = StandardAdress + "ships/";
        public const String ShipFromEventId = StandardAdress + "ships/fromEventId/";
    }
}
