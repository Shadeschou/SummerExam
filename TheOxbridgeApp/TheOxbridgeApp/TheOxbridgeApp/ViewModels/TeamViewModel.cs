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
using System.Threading;
using Xamarin.Forms.PlatformConfiguration;

namespace TheOxbridgeApp.ViewModels
{
    public class TeamViewModel : BaseViewModel
    {

        public Team selectedTeamObject = new Team();


        private Team selectedTeam;

        public Team SelectedTeam
        {
            get { return selectedTeam; }
            set { selectedTeam = value; OnPropertyChanged(); }
        }

        DataController datacontroller;


        public int currentSelectedEventReg { get; set; }

        public Event SelectedEvent { get; set; }

        public SingletonSharedData sharedData;

        public int ShipIDTemp { get; set; }

        public int EventIDTemp { get; set; }

        public String TeamNameTemp { get; set; }

        public String TrackColorTemp { get; set; }

        public Image imageTest;

        public String CurrentShip { get; set; }

        public string ViewModelEmailUserName { get; set; }


        // public Event ships = new Event();

        //public ObservableCollection<Event> Events;

        public List<TrackingEvent> listOfTrackingEvents;


        public int CurrentRegId { get; set; }


        private ServerClient serverClient;

        public string PhotoPath { get; set; }
        public String ViewModelStatus { get; set; }

        public Event chosenEvent;

        public Event ChosenEvent { get; set; }



        public List<Event> ListOfEvents;

        public List<Ship> ListOfShips;




        private ObservableCollection<Team> teamObservable = new ObservableCollection<Team>();
        public ObservableCollection<Team> TeamObservable
        {
            get { return teamObservable; }
            set
            {
                teamObservable = value; OnPropertyChanged();
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

        public async void TakeCameraPhoto()
        {



            try
            {
                var photo = await MediaPicker.CapturePhotoAsync();
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

        public TeamViewModel(Event currentEvent) 
        {

           chosenEvent = currentEvent;
        }
        /// <summary>
        /// This is where the photo will be picked and then forwarded into the moethod called LoadPhoto in order to meake a new FIle with the path inside the cache 
        /// </summary>
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
        /// <summary>
        /// This is where the photo is loaded from the Cache from the mobile and save the file and have the photoPath containing the filePath for the picture
        /// </summary>
        /// <param name="photo"></param>
        /// <returns></returns>
        public async Task LoadPhotoAsync(FileResult photo)
        {
            Stream newStream = null;            // canceled
            if (photo == null)
            {
                PhotoPath = null;
                return;
            }
            // save the file into local storage
            var newFile = Path.Combine(FileSystem.CacheDirectory, photo.FileName);
            using (var stream = await photo.OpenReadAsync())

            using ( newStream = File.OpenWrite(newFile))
                await stream.CopyToAsync(newStream);
           


            Console.WriteLine(newStream.ToString());
           

            //Teams newTeam = new Teams();
           
            PhotoPath = newFile;

            

            Team addPictureTeam = new Team();

            Team newTeam = new Team();

            


            

            newTeam.TeamImageSourcePicture = PhotoPath;
            Console.WriteLine("This is the photoPath " +newTeam.ImageSourceContainer);

          

            
          // newTeam.ImageByte = Encoding.ASCII.GetBytes(PhotoPath);

            var result = newTeam.ImageByte;

          

            

            // Stream stream = new MemoryStream(test);


            // test = Encoding.UTF8.GetBytes(PhotoPath.Trim(new char[] { ',' }));
            //  Convert.ToBase64String(test);




            // newTeam.TeamImageSourcePicture = ImageSource.FromStream(() => new MemoryStream(newTeam.ImageByte));

            //var path = "/data/user/0/com.companyname.theoxbridgeapp/cache/20210603_200355.jpg";
            //File.WriteAllBytes(path,newTeam.ImageByte);

            User user = new User();


            
           List<Team> teamList = new List<Team>();

            user = await datacontroller.GetUser();

            Team team = new Team();
            teamList = serverClient.GetAllRegistration();
            teamObservable = new ObservableCollection<Team>(teamList);

            foreach (var item in from item in teamList where item.emailUsername == user.EmailUsername && CurrentRegId == item.EventRegId select new {item.EventRegId, item.emailUsername })
            {
                foreach (var items in teamList)
                {
                    team.teamImage = items.teamImage;
                }
            }


            addPictureTeam = new Team { teamImage = PhotoPath, emailUsername = user.EmailUsername };
            serverClient.PutData(addPictureTeam, Target.PutImages + CurrentRegId);

            teamList = serverClient.GetAllRegistration();

            //newTeam.ImageByte = Convert.FromBase64String(PhotoPath);





            //teamList = serverClient.GetAllRegistration();

            // foreach (var item in teamList)
            //  {


            // item.teamImage = Convert.FromBase64String(PhotoPath);
            // Encoding.UTF8.GetString(item.teamImage);

            //   }

            TeamObservable = new ObservableCollection<Team>(teamList);



            //newTeam.TeamImageBytes = Encoding.ASCII.GetBytes(PhotoPath);






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

       public async void tryEncodeSetup() 
        {

            EncodeBase64("Det her er min string");
        
        }

        public void EncodeBase64(string plainText) 
        {
            var textinbytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            Console.WriteLine(Convert.ToBase64String(textinbytes));
            DecodeBase64(Convert.ToBase64String(textinbytes));
        
        
        }
        public void DecodeBase64(string encodedText) 
        {
            var textencoded = Convert.FromBase64String(encodedText);
            Console.WriteLine(System.Text.Encoding.UTF8.GetString(textencoded));
        
        }

        public ICommand TakeCameraPhotoCMD { get; set; }

        public ICommand AddToDB { get; set; }

     public ICommand fetchListCMD { get; set; }
       
        public async void addImageString() 
        {


            string image = "TeamIcon.png";

            selectedTeam.ImageSourceContainer = image;

            serverClient.PutData(SelectedTeam, Target.PutImages + selectedTeam.EventRegId);

            Console.WriteLine("This is the image console" +selectedTeam.EventRegId+ Target.PutImages);
        }
       


        public TeamViewModel()
        {
            TakeCameraPhotoCMD = new Command(TakeCameraPhoto);
            datacontroller = new DataController();
            fetchListCMD = new Command(setupList);
            sharedData = SingletonSharedData.GetInstance();

            SelectedEvent = sharedData.SelectedEvent;

            TeamObservable = new ObservableCollection<Team>();

            serverClient = new ServerClient();

            AddToDB = new Command(TakePhotoAsync);

            Console.WriteLine("This is the Constructor");
           setupList();

           //addImageString();

           


            



        }



    }
}