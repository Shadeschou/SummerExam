using System;
using Xamarin.Forms.Maps;

namespace TheOxbridgeApp
{
    public class CustomPin : Pin
    {
        public String Name { get; set; }
        public String ShipId { get; set; }

        public String TeamName { get; set; }
    }
}
