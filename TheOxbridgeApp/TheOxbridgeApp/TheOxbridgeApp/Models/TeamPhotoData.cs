using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class TeamPhotoData
    {

        public int ShipID { get; set; }
        public int EventID { get; set; }

        public int EventRegID { get; set; }

        public String TrackColor { get; set; }

        public byte[] TeamImageBytes { get; set; }
        public String TeamName { get; set; }


        public ImageSource TeamPhoto { get; set; }


    }
}
