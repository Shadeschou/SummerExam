using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheOxbridgeApp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace TheOxbridgeApp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TeamView : ContentPage
    {
        public TeamView()
        {
            InitializeComponent();
            
        }

        private void ContentPage_Appearing(object sender, EventArgs e)
        {
        }


    }
}