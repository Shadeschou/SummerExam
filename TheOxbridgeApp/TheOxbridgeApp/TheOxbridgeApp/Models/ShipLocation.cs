using System;
using System.Collections.Generic;

namespace TheOxbridgeApp.Models
{
    public class ShipLocation
    {
        public List<Location> LocationsRegistrations { get; set; }

        public String Color { get; set; }

        public int ShipId { get; set; }

        public String TeamName { get; set; }

        public int Placement { get; set; }
    }
}
