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
        
        public string TeamID { get; set; }

        public String Name { get; set; }

       // public String Username { get; set; }
       public string TeamImage { get; set; }
        public byte[] TeamImageBytes { get; set; }

        public ImageSource TeamFilePicker { get; set; }

       // public TeamImage { get; set; }
    }
}
