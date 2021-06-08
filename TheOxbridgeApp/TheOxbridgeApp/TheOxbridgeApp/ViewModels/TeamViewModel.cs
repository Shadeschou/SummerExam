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
using System.Linq;
using System.Drawing;

namespace TheOxbridgeApp.ViewModels
{
    public class TeamViewModel : BaseViewModel
    {

        public Team selectedTeamObject = new Team();


        private Team selectedTeam;

        public Team SelectedTeam
        {
            get { return selectedTeam; }
            set { selectedTeam = value; }
        }




        public Event SelectedEvent { get; set; }

        public SingletonSharedData sharedData;

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




        private ObservableCollection<Team> teamObservable;
        public ObservableCollection<Team> TeamObservable
        {
            get { return teamObservable; }
            set
            {
                teamObservable = value;
            }
        }


        


        private ObservableCollection<TeamPhotoData> teamPhotData;
        public ObservableCollection<TeamPhotoData> TeamPhotoData
        {
            get { return teamPhotData; }
            set
            {
                teamPhotData = value;
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



            Team addPictureTeam = new Team();

            Team newTeam = new Team();

            newTeam.ImageSourceContainer = PhotoPath;

            Console.WriteLine(PhotoPath);

            
           newTeam.ImageByte = Encoding.ASCII.GetBytes(PhotoPath);

            var result = newTeam.ImageByte;

            //PhotoPath = Convert.ToBase64String(newTeam.ImageByte);

            // newTeam.ImageByte = Convert.FromBase64String(PhotoPath);

            // newTeam.TeamImageSourcePicture = ImageSource.FromStream(() => new MemoryStream(newTeam.ImageByte));

            // var path = "/data/user/0/com.companyname.theoxbridgeapp/cache/20210603_200355.jpg";
            //File.WriteAllBytes(path,newTeam.ImageByte);

            addPictureTeam = new Team { teamImage = PhotoPath, TrackColor = "Green", TeamName = "Collio", emailUsername = "abc@abc.com" };
            serverClient.PutData(addPictureTeam, Target.PutImages + 0);

            //newTeam.ImageByte = Convert.FromBase64String(PhotoPath);
            newTeam = new Team
            {
                TeamImageSourcePicture = PhotoPath,
                
                ImageByte = result,

            };

            TeamObservable.Add(newTeam);

            

            

            

           

           

          
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

        /*
        private ImageSource convertBasic64String(string basic64) 
        {

            var imageBytes = System.Convert.FromBase64String(basic64);

            // Return a new ImageSource
            return ImageSource.FromStream(() => { return new MemoryStream(imageBytes); });
        

               
        }
        */
        public async void setupList() 
        {
            User user = new User();
            Team newTeam = new Team();
            List<Team> teamList = new List<Team>();
            
            teamList = serverClient.GetAllRegistration();

           
           
            /*
            foreach (var item in teamList)
            {
                item.TeamImageSourcePicture = convertBasic64String(item.teamImage);
            }
          */


              //selectedTeam = (from Team in teamList where Team.emailUsername == user.EmailUsername select Team).FirstOrDefault();

            teamObservable = new ObservableCollection<Team>(teamList);

           

        }



        public ICommand AddToDB { get; set; }

     
       
        public async void addImageString() 
        {


            string image = "TeamIcon.png";

            selectedTeam.ImageSourceContainer = image;

            serverClient.PutData(SelectedTeam, Target.PutImages + selectedTeam.EventRegId);

            Console.WriteLine("This is the image console" +selectedTeam.EventRegId+ Target.PutImages);
        }
       


        public TeamViewModel()
        {
            sharedData = SingletonSharedData.GetInstance();

            SelectedEvent = sharedData.SelectedEvent;

            TeamObservable = new ObservableCollection<Team>();

            serverClient = new ServerClient();

            AddToDB = new Command(TakePhotoAsync);

            Console.WriteLine("This is the Constructor");

           //addImageString();
           setupList();

           


            



        }



    }
}