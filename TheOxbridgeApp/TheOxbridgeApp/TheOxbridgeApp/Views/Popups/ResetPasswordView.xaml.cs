using Rg.Plugins.Popup.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheOxbridgeApp.ViewModels.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace TheOxbridgeApp.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ResetPasswordView : PopupPage
    {
        public ResetPasswordView()
        {
            InitializeComponent();
            this.BindingContext = new ResetPasswordViewModel();
        }
    }
}