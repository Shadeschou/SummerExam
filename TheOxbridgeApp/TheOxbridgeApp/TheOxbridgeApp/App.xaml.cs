using Rg.Plugins.Popup.Services;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using TheOxbridgeApp.ViewModels;
using TheOxbridgeApp.Views;
using TheOxbridgeApp.Views.Popups;
using Xamarin.Forms;

namespace TheOxbridgeApp
{
    public partial class App : Application
    {
        #region -- Local variables -- 
        private INavigationService navigationService;
        private ISettingsService _settingsService;
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

            var masterDetailViewModel = new MasterDetailViewModel();
            ServiceContainer.Register(() => masterDetailViewModel);

            var master = new MasterDetail();
            MainPage = master;
            master.BindingContext = masterDetailViewModel;
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
