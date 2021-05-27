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

        // public Event ships = new Event();

        //public ObservableCollection<Event> Events;

        private ServerClient serverClient;

        public string PhotoPath { get; set; }


        public Event SelectedEvent { get; set; }


        public List<Event> ListOfEvents;


        public List<TeamPhotoData> ListOfPhotoData { get; set; }


        private ObservableCollection<TeamPhotoData> teamPhotoList;
        public ObservableCollection<TeamPhotoData> TeamPhotoList
        {
            get { return teamPhotoList; }
            set
            {
                teamPhotoList = value;
            }
        }

        private ObservableCollection<Event> eventObservable;
        public ObservableCollection<Event> EventObservable
        {
            get { return eventObservable; }
            set
            {
                eventObservable = value;
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

        private async void PickPhoto()
        {



            Teams TeamsAddpicture = new Teams();

            var result = await MediaPicker.PickPhotoAsync(new MediaPickerOptions

            {
                Title = "Please pick a photo"

            });
            var stream = await result.OpenReadAsync();

            TeamsAddpicture.TeamFilePicker = ImageSource.FromStream(() => stream);

            var container = TeamsAddpicture.TeamFilePicker;


            var teams = new Teams
            {

                TeamID = 1,
                Name = "Sven",
                TeamFilePicker = container,

            };

            TeamsList.Add(teams);

        }


        public async void mediaPickerToGallery()
        {






            var results = await MediaGallery.PickAsync(1, MediaFileType.Image, MediaFileType.Video);

            if (results?.Files == null)
                return;

            foreach (var file in results.Files)
            {
                var fileName = file.NameWithoutExtension; //Can return an null or empty value
                var extension = file.Extension;
                var contentType = file.ContentType;
                var stream = await file.OpenReadAsync();


                //...
                file.Dispose();


            }


            /*
            var status = await Permissions.RequestAsync<SaveMediaPermission>();
            if (status != PermissionStatus.Granted)
                return;
            await MediaGallery.SaveAsync(MediaFileType.Video, filePath);
            //OR Using a byte array or a stream
            await MediaGallery.SaveAsync(MediaFileType.Image, stream, fileName);
            */
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

            Teams newTeam = new Teams();
            // newTeam.TeamImageBytes = photo;
            PhotoPath = newFile;



            // var service = new TeamService();

            
            newTeam.TeamImageBytes = Encoding.ASCII.GetBytes(PhotoPath);

            var result = newTeam.TeamImageBytes;
            // byte[] binaryContent = File.ReadAllBytes(PhotoPath);
            var teams = new Teams
            {

                TeamID = 1,
                Name = "Karl",
                TeamFilePicker = PhotoPath,
                TeamImageBytes = result,

            };
            //Events.Add(ships);
            TeamsList.Add(teams);

            // service.Create(teams);
        }



        public async Task savepicture(FileResult photo)
        {


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

            PhotoPath = newFile;

            TeamPhotoData teamPhotObject = new TeamPhotoData();
            teamPhotObject.TeamImageBytes = Encoding.ASCII.GetBytes(PhotoPath);

        
          





            






            // var screenshot = await Screenshot.CaptureAsync();

            // await MediaGallery.SaveAsync(MediaFileType.Image, await screenshot.OpenReadAsync(), "MyScreenshot.png");


        }

        public async void setupList() 
        {

           ListOfEvents = serverClient.GetEvents();


            TrackingEvent trackingEvent = new TrackingEvent();


            // EventObservable = new ObservableCollection<TrackingEvent>(ListOfEvents);

            EventObservable = new ObservableCollection<Event>(ListOfEvents);
            
           // TrackingEvent trackingEvent = new TrackingEvent { 
             //  Name = ,  City = "Sønderborg" };

           // EventObservable.Add(ListOfEvents);

          //  foreach (var item in ListOfEvents)
           // {
           //     EventObservable.Add(item);
          //  }


        }



        public ICommand AddToDB { get; set; }

        public ICommand SaveImage { get; set; }
        private async void InsertPictureToDB()
        {
            try
            {
                var service = new TeamService();

                byte[] binaryContent = File.ReadAllBytes("TeamIcon.png");

                var teams = new Teams
                {
                    TeamID = 1,
                    Name = "Torben",
                    TeamImageBytes = binaryContent,


                };

                //service.Create(teams);
                Console.WriteLine("Hello there");

            }
            catch (Exception)
            {

                Console.WriteLine("Error");
            }
        }


        /*
         * 
            _teams = database.GetCollection<Teams>("TeamsPicture");
         * 
         * 
         * 
         */


        public TeamViewModel()
        {
            AddToDB = new Command(TakePhotoAsync);
            // SaveImage = new Command(savepicture);
            setupList();
             //  Events = new ObservableCollection<Event>();
            


           

          //  TestData context = new TestData();


           // foreach (var teams in context.Teams)
           // {
               // TeamsList.Add(teams);
            //}

        }



    }
}