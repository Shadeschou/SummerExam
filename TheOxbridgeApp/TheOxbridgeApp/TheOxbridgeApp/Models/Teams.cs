using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class Teams
    {

        public Ship Ships { get; set; }
        public User user { get; set; }
        public Event Events { get; set; }
        public int TeamID { get; set; }

        public String City { get; set; }
        public String Name { get; set; }




        public String ShipName { get; set; }

        public string TeamImage { get; set; }
        public byte[] TeamImageBytes { get; set; }

        public ImageSource TeamFilePicker { get; set; }

       // public TeamImage { get; set; }
    }
}
