using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using Xunit;

namespace XUnitAndroid
{
    public class XUnitTest
    {

        #region -- Local variables --
        private ServerClient serverClient;
        private const string target = "http://10.1.2.2:3000/";
        string response;
        private DataController dataController;

      
       

        private const int testEventRegId = 2;

        private const double testLongtitude = 10.038299;

        private const double testLatitude = 54.928011;

        private const String username = "hans.hansen@gmail.com";
        private const String resetPassword = "Jonas.pilbak@hotmail.com";
        private const String password = "hans1234";
        #endregion

        public XUnitTest()
        {
            serverClient = new ServerClient();
            dataController = new DataController();
        }

        /// <summary>
        /// Tests if a Location can be posted to the backend
        /// </summary>
        /// 
        
        [Fact]
        public void TestRegisterLocation()
        {
            dataController.SaveUser(serverClient.Login(username, password));

            Location location = new Location
            {
                EventRegId = testEventRegId,
                LocationTime = DateTime.Now,
                Longtitude = testLongtitude,
                Latitude = testLatitude
            };

            bool isSucces = serverClient.PostData(location, Target.Locations).Result;

            Assert.True(isSucces);
        }
        


        [Fact]
        public void TestGetAllRegistration()
        {

            List<Team> eventReg = serverClient.GetAllRegistration();
            Assert.NotNull(eventReg);
        }

        [Fact]
        public void TestUnreachableRoute() 
        {
            Assert.Throws<WebException>(() =>
            {
                WebRequest request = WebRequest.Create(target);
                request.Timeout = 10;
                request.Method = "GET";
                request.ContentType = "application/json";
                response = GetResponse(request);
            }
                );

        }

        [Fact]
        public void TestLocationRoutes() 
        {

           

            WebRequest request = WebRequest.Create(Target.ForgotPassword + resetPassword);

            request.Method = "POST";
            request.ContentType = "application/json";
            
            

            String statusCode = GetStatusCode(request);

          

            Assert.Equal("Accepted", statusCode);

        }
        
        [Fact]
        public void TestBroadCast() 
        {


            String jsonData = "{\"Username\": \"" + "Jonas.pilbak@hotmail.com" + "\" }";

            WebRequest request = WebRequest.Create(Target.MessageFromEmailUsername);
            request.Method = "POST";
            request.ContentType = "application/json";

            List<Broadcast> Message = new List<Broadcast>();
            try
            {
                using (Stream requestStream = request.GetRequestStream())
                {
                    using (StreamWriter streamWriter = new StreamWriter(requestStream))
                    {
                        streamWriter.Write(jsonData);
                    }
                }

                try
                {

                    String statusCode = GetStatusCode(request);

                    String responseFromServer = GetResponse(request);
                    Message = JsonConvert.DeserializeObject<List<Broadcast>>(responseFromServer);

                    Assert.NotNull(Message);

                    Assert.Equal("Accepted", statusCode);

                }
                catch (WebException e)
                {
                    Console.WriteLine(e);
                }
               
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Message = null;
              
            }


        }

        private String GetStatusCode(WebRequest request)
        {
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                return response.StatusCode.ToString();
            }
        }

        private String GetResponse(WebRequest request)
        {
            String responseFromServer = "";

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                using (Stream responseStream = response.GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(responseStream))

                        responseFromServer = reader.ReadToEnd();
                }

                return responseFromServer;
            }
        }

        /// <summary>
        /// Tests if live locations can be recieved from the backend
        /// </summary>
        [Fact]
        public void TestGetLiveLocations()
        {
            List<ShipLocation> shipLocations = serverClient.GetLiveLocations(testEventRegId);

            Assert.NotNull(shipLocations);
        }

        /// <summary>
        /// Tests the calculation of direction / angle between two points
        /// </summary>
        /// <param name="firstLongtitude"></param>
        /// <param name="firstLatitude"></param>
        /// <param name="secondLongtitude"></param>
        /// <param name="secondLatitude"></param>
        /// <param name="expected">Expected angle as a double</param>
        [Theory]
        [InlineData(10.056691, 54.934157, 10.071471, 54.947698, 74.1677586635005)]
        [InlineData(10.026863, 54.987846, 10.014122, 54.988187, 311.4835051025)]
        public void TestCalculateDirection(double firstLongtitude, double firstLatitude, double secondLongtitude, double secondLatitude, double expected)
        {
            Location firstLocation = new Location { Longtitude = firstLongtitude, Latitude = firstLatitude };
            Location secondLocation = new Location { Longtitude = secondLongtitude, Latitude = secondLatitude };

            double actual = CalculateDirection(firstLocation, secondLocation);

            Assert.Equal(expected, actual, 4);
        }

        /// <summary>
        /// The method which calculates the angle between two Locations, taken from the MapViewModel
        /// </summary>
        /// <param name="firstLocation"></param>
        /// <param name="secondLocation"></param>
        /// <returns>Returns the angle as a double</returns>
        public double CalculateDirection(Location firstLocation, Location secondLocation)
        {
            if (firstLocation != null & secondLocation != null)
            {
                double angle = (Math.Atan2(secondLocation.Latitude - firstLocation.Latitude, secondLocation.Longtitude - firstLocation.Longtitude)) * 100;
                if (angle < 0)
                {
                    angle = angle * -1;
                }
                return angle;
            }
            else
            {
                return 0;
            }
        }
    }
}