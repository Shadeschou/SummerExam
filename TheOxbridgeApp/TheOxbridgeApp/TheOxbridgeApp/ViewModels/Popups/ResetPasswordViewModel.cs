using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using TheOxbridgeApp.Services;
using Xamarin.Forms;

namespace TheOxbridgeApp.ViewModels.ViewModels
{
   public class ResetPasswordViewModel : BaseViewModel 
    {
       public ServerClient serverClient;


        public Entry ClearText { get; set; }

        public string emailUsername { get; set; }

        public ResetPasswordViewModel()
        {
            serverClient = new ServerClient();
            ForgotPasswordCMD = new Command(ResetPassword);



        }

        public ICommand ForgotPasswordCMD { get; set; }

        /// <summary>
        /// This is using the service called serverClient to make a post call to the the backend 
        /// THe user writes their username in an entry field and then it will be posted and the user will receive an email with a new password
        /// </summary>
        private async void ResetPassword() 
        {
            
            serverClient.ForgotPassword(emailUsername);


           
        }
    }
}
