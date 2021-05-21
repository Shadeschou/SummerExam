using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;
using TheOxbridgeApp.Models;

namespace TheOxbridgeApp.Services
{
    public class TeamService
    {
        private readonly IMongoCollection<Teams> _teams;
        public TeamService() 
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("OxbridgeDB");
            _teams = database.GetCollection<Teams>("TeamsPicture");
        }


        public Teams Get(string teamsId)
        {
            var result = _teams.Find(
                 q => q.TeamID == teamsId).FirstOrDefault();
            return result;
        }
        public Teams Create(Teams teams)
        {
            _teams.InsertOne(teams);
            return teams;
        }

    }
}
