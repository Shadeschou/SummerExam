using Newtonsoft.Json;
using System;

using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class Team : ISerializable
    {

        public int ShipID { get; set; }

       // [JsonProperty("eventId")]
        public int EventID { get; set; }
        //[JsonProperty("eventRegId")]
        public int EventRegId { get; set; }
       // [JsonProperty("teamName")]
        public String TeamName { get; set; }
       // [JsonProperty("emailUsername")]
        public string emailUsername { get; set; }

        public byte[] ImageByte { get; set; }

        //[JsonProperty("trackColor")]
        public String TrackColor { get; set; }
        public ImageSource TeamImageSourcePicture { get; set; }
        public String ImageSourceContainer{ get; set; }

        //[JsonProperty("teamImage")]
        [JsonProperty("teamImage")]
        public String teamImage { get; set; } 




    }
}
