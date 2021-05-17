using System;
using TheOxbridgeApp.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace TheOxbridgeApp.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EventView : ContentPage
    {
        public EventView()
        {
            InitializeComponent();
        }


        private void ContentPage_Appearing(object sender, EventArgs e)
        {
            ((EventViewModel)this.BindingContext).OnAppearing();
        }
    }
}