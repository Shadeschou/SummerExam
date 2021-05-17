using Rg.Plugins.Popup.Services;
using System;
using System.Windows.Input;
using TheOxbridgeApp.Data;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.Services;
using TheOxbridgeApp.Views;
using TheOxbridgeApp.Views.Popups;
using Xamarin.Forms;

namespace TheOxbridgeApp.ViewModels
{
    class LoginViewModel : BaseViewModel
    {
        #region -- Local variables --
        private ServerClient serverClient;
        private DataController dataController;
        private SingletonSharedData sharedData;
        #endregion

        #region -- Commands --
        public ICommand LoginCMD { get; set; }
        public ICommand EntryFocusedCommand { get; set; }
        public ICommand LoginClickedCMD { get; set; }
        #endregion

        #region -- Binding values --
        private bool wrongLoginVisibility;
        public bool WrongLoginVisibility
        {
            get { return wrongLoginVisibility; }
            set { wrongLoginVisibility = value; OnPropertyChanged(); }
        }

        private String username;
        public String Username
        {
            get { return username; }
            set { username = value; OnPropertyChanged(); }
        }

        private String password;
        public String Password
        {
            get { return password; }
            set { password = value; OnPropertyChanged(); }
        }

        #endregion

        public LoginViewModel()
        {
            serverClient = new ServerClient();
            sharedData = SingletonSharedData.GetInstance();
            dataController = new DataController();

            LoginCMD = new Command(Login);
            EntryFocusedCommand = new Command(EntryFocused);
            LoginClickedCMD = new Command(Login);
        }

        /// <summary>
        /// Authenticates the user and if it success, it saves the user securely and navigates to the EventView
        /// </summary>
        private async void Login()
        {
            await PopupNavigation.PushAsync(new LoadingPopupView()).ConfigureAwait(false);
            User user = serverClient.Login(username, password);
            if (user != null)
            {
                user.Password = password;
                dataController.SaveUser(user);
                ((MasterDetailViewModel)((MasterDetail)Application.Current.MainPage).BindingContext).OnAppearing();
                await NavigationService.NavigateToAsync(typeof(EventViewModel));
            }
            else
            {
                WrongLoginVisibility = true;
                PopupNavigation.PopAllAsync();
            }
        }

        private void EntryFocused()
        {
            WrongLoginVisibility = false;
        }
    }
}
