using System;

namespace TheOxbridgeApp.Services
{
    public interface ISettingsService
    {
        String AuthAccessToken { get; set; }
        String AuthIdToken { get; set; }
    }
}
