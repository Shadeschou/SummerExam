using System;
using System.Collections.Generic;
using System.Text;
using TheOxbridgeApp.Models;

namespace TheOxbridgeApp.Data
{
   public class TestData
    {

        
        public List<Teams> Teams { get; private set; }

        public TestData()

        {


            Teams = new List<Teams>();
            Teams.Add(new Teams
            {


                TeamID = "1",
                Name = "John",
                // TeamImage = "TeamIcon.png",


            });


            Teams.Add(new Teams
            {


                TeamID = "2",
                Name = "Sven",
                //TeamImage = "TeamIcon.png",


            });


            Teams.Add(new Teams
            {


                TeamID = "3",
                Name = "Bob",
                //TeamImage = "TeamIcon.png",


            });

        }
        
        
    }
}
