using System;
using TheOxbridgeApp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace TheOxbridgeApp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TrackingEventView : ContentPage
    {
        public TrackingEventView()
        {
            InitializeComponent();
        }

        private void ContentPage_Appearing(object sender, EventArgs e)
        {
            ((TrackingEventViewModel)this.BindingContext).OnAppearing();

        }
    }
}