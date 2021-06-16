using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace TheOxbridgeApp.Models
{
    public class Broadcast : BindableObject
    {

        private string message;

        public string Message
        {
            get { return message; }
            set { message = value; OnPropertyChanged(); }
        }

        private int eventId;

        public int EventId

        {
            get { return eventId; }
            set { eventId = value; }
        }

        private string emailUsername;


        public string EmailUsername

        {
            get { return emailUsername; }
            set { emailUsername = value; }
        }



    }
}
