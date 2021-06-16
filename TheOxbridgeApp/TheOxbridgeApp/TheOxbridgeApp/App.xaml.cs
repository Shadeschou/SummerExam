using Rg.Plugins.Popup.Services;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Threading;
using System;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using TheOxbridgeApp.ViewModels;
using TheOxbridgeApp.Views;
using TheOxbridgeApp.Views.Popups;
using Xamarin.Forms;
using System.Collections.Generic;

namespace TheOxbridgeApp
{
    public partial class App : Application
    {
        #region -- Local variables -- 
        private INavigationService navigationService;
        private ISettingsService _settingsService;
        public static CancellationTokenSource CancellationToken { get; set; }
        #endregion

        /// <summary>
        /// Registers all ViewModels to the ServiceContainer and the MainPage is set
        /// </summary>
        public App()
        {
            InitializeComponent();

            ServiceContainer.Register<ISettingsService>(() => new SettingsService());
            _settingsService = ServiceContainer.Resolve<ISettingsService>();
            ServiceContainer.Register<INavigationService>(() => new NavigationService(_settingsService));

            ServiceContainer.Register(() => new LoginViewModel());
            ServiceContainer.Register(() => new MapViewModel());
            ServiceContainer.Register(() => new EventViewModel());
            ServiceContainer.Register(() => new TrackingEventViewModel());
            ServiceContainer.Register(() => new TeamViewModel());
            ServiceContainer.Register(() => new ListEventViewModel());
            ServiceContainer.Register(() => new ResetPasswordView());


            var masterDetailViewModel = new MasterDetailViewModel();
            ServiceContainer.Register(() => masterDetailViewModel);

            var master = new MasterDetail();
            MainPage = master;
            master.BindingContext = masterDetailViewModel;
        }



        private async Task timer()
        {

            App.CancellationToken = new CancellationTokenSource();
            while (!App.CancellationToken.IsCancellationRequested)
            {
                try
                {

                    App.CancellationToken.Token.ThrowIfCancellationRequested();
                    await Task.Delay(10000, App.CancellationToken.Token).ContinueWith(async (arg) =>
                    {

                        if (!App.CancellationToken.Token.IsCancellationRequested)
                        {
                            App.CancellationToken.Token.ThrowIfCancellationRequested();


                            DataController dataController = new DataController();
                            ServerClient serverClient = new ServerClient();
                            User user = await dataController.GetUser();

                            List<Broadcast> messages = serverClient.GetMessagesFromEmailUsername(user.EmailUsername);

                            if (messages.Count > 0)
                            {
                                foreach (var item in messages)
                                {

                                    Device.BeginInvokeOnMainThread(async () => { await Current.MainPage.DisplayAlert("Message", item.Message, "ok"); });
                                }
                            }



                        }


                    });
                }



                catch (Exception ex)
                {
                    Debug.WriteLine("EX 1: " + ex.Message);

                }
            }
        }


        private void InitNavigation()
        {
            navigationService = ServiceContainer.Resolve<INavigationService>();
        }

        /// <summary>
        /// Calls MasterDetailViewModel to setup the MasterDetail MenuItems and navigates to the EventView
        /// </summary>
        protected async override void OnStart()
        {
            base.OnStart();
            InitNavigation();

            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);
            await ((MasterDetailViewModel)((MasterDetail)Current.MainPage).BindingContext).OnAppearing();
            await navigationService.NavigateToAsync(typeof(EventViewModel));

            Task.Run(async () => timer());
        }

        protected override void OnSleep()
        {
            base.OnSleep();
        }

        protected override void OnResume()
        {
        }
    }
}
