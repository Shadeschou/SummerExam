using MongoDB.Driver;
using NativeMedia;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace TheOxbridgeApp.ViewModels
{
    public class TeamViewModel : BaseViewModel
    {


        public int ShipIDTemp { get; set; }

        public int EventIDTemp { get; set; }

        public String TeamNameTemp { get; set; }

        public String TrackColorTemp { get; set; }

        

        public String CurrentShip { get; set; }

        public string ViewModelEmailUserName { get; set; }


        // public Event ships = new Event();

        //public ObservableCollection<Event> Events;

        public List<TrackingEvent> listOfTrackingEvents;


        private ServerClient serverClient;

        public string PhotoPath { get; set; }
        public String ViewModelStatus { get; set; }

        public Event chosenEvent;

        public Event ChosenEvent { get; set; }



        public List<Event> ListOfEvents;

        public List<Ship> ListOfShips;




        private ObservableCollection<Team> teamList;
        public ObservableCollection<Team> TeamList
        {
            get { return teamList; }
            set
            {
                teamList = value;
            }
        }


        


        private ObservableCollection<Teams> teamsList;
        public ObservableCollection<Teams> TeamsList
        {
            get { return teamsList; }
            set
            {
                teamsList = value;
            }
        }



        public TeamViewModel(Event currentEvent) 
        {

           chosenEvent = currentEvent;
        }

        public async void TakePhotoAsync()
        {



            try
            {
                var photo = await MediaPicker.PickPhotoAsync();
                await LoadPhotoAsync(photo);
                Console.WriteLine($"CapturePhotoAsync COMPLETED: {PhotoPath}");
            }
            catch (FeatureNotSupportedException fnsEx)
            {
                // Feature is now supported on the device
            }
            catch (PermissionException pEx)
            {
                // Permissions not granted
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CapturePhotoAsync THREW: {ex.Message}");
            }

        }
        public async Task LoadPhotoAsync(FileResult photo)
        {
            // canceled
            if (photo == null)
            {
                PhotoPath = null;
                return;
            }
            // save the file into local storage
            var newFile = Path.Combine(FileSystem.CacheDirectory, photo.FileName);
            using (var stream = await photo.OpenReadAsync())
            using (var newStream = File.OpenWrite(newFile))
                await stream.CopyToAsync(newStream);





            //Teams newTeam = new Teams();
           
            PhotoPath = newFile;




           

           

          
            //newTeam.TeamImageBytes = Encoding.ASCII.GetBytes(PhotoPath);

            DataController dataController = new DataController();


            
           // User user = new User();

           

           // user = await dataController.GetUser();

          
           

            //var getName = user.FirstName;

           // var result = newTeam.TeamImageBytes;
            // byte[] binaryContent = File.ReadAllBytes(PhotoPath);
            /*
            var teams = new Teams
            {

                TeamID = 1,
                Name = "Test",
                TeamFilePicker = PhotoPath,
                TeamImageBytes = result,

                
            };
            */
            
            //Events.Add(ships);
           // TeamsList.Add(teams);

            // service.Create(teams);
        }



        
        public async void setupList() 
        {
            User user = new User();

            DataController dataController = new DataController();



          

            //TeamList = new ObservableCollection<Team>(serverClient.GetTeams());





          //  foreach (var team in TeamList)
          //  {

          //  serverClient.PutData(team, Target.PutImages + $"/{team.EventRegId}");
          //  }






            // trackingEvent = await serverClient.GetTrackingEvents();









        }



        public ICommand AddToDB { get; set; }

     
       

       


        public TeamViewModel()
        {
            serverClient = new ServerClient();

            AddToDB = new Command(TakePhotoAsync);
            TeamsList = new ObservableCollection<Teams>();
            setupList();
          
           




        }



    }
}