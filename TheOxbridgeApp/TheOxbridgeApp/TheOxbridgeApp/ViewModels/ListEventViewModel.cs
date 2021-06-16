using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using TheOxbridgeApp.Models;

namespace TheOxbridgeApp.ViewModels
{
    public class ListEventViewModel : BaseViewModel
    {
        private ObservableCollection<Event> events;

        public ObservableCollection<Event> Events
        {
            get { return events; }
            set { events = value; OnPropertyChanged(); }
        }

        private Event selectedEvent;

        public Event SelectedEvent
        {
            get { return selectedEvent; }
            set { selectedEvent = value; OnPropertyChanged(); }
        }


        public async void OnAppearing()
        {
          
            
          
        }



    }
}
