using Newtonsoft.Json;
using System;

namespace TheOxbridgeApp.Models
{
    public class User : ISerializable
    {
        

        [JsonProperty("emailUsername")]
        public String EmailUsername { get; set; }
        public String FirstName { get; set; }
        public String LastName { get; set; }
        public String Password { get; set; }
        public String Token { get; set; }


    }
}
