using Newtonsoft.Json;
using System;

using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class Team : ISerializable
    {

        public int ShipID { get; set; }

       
        public int EventID { get; set; }

        public int EventRegId { get; set; }
      
        public String TeamName { get; set; }
    
        public string emailUsername { get; set; }

        public byte[] ImageByte { get; set; }

       
       
        public String TrackColor { get; set; }
        public ImageSource TeamImageSourcePicture { get; set; }
        public String ImageSourceContainer{ get; set; }

        //[JsonProperty("teamImage")]
        [JsonProperty("teamImage")]
        public String teamImage { get; set; } 




    }
}
