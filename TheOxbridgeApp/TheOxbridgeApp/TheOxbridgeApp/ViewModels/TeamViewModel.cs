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


        public string PhotoPath { get; set; }


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

                TeamID = "1",
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




            newTeam.TeamImageBytes = Encoding.ASCII.GetBytes(PhotoPath);

            var result = newTeam.TeamImageBytes;
            var teams = new Teams
            {

                TeamID = "1",
                Name = "Sven",
                TeamFilePicker = PhotoPath,
                TeamImageBytes = result,

            };

            TeamsList.Add(teams);
        }



        public async void savepicture() 
        {

           // var screenshot = await Screenshot.CaptureAsync();

           // await MediaGallery.SaveAsync(MediaFileType.Image, await screenshot.OpenReadAsync(), "MyScreenshot.png");


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
                TeamID = "1",
                Name = "Torben",
               // TeamImageBytes = binaryContent,
                

            };

            service.Create(teams);
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
            SaveImage = new Command(savepicture);


            TeamsList = new ObservableCollection<Teams>();


            TestData context = new TestData();


            foreach (var teams in context.Teams)
            {
                TeamsList.Add(teams);
            }
        
        }



    }
}
