using Rg.Plugins.Popup.Pages;
using TheOxbridgeApp.Models;
using TheOxbridgeApp.ViewModels.Popups;
using Xamarin.Forms.Xaml;

namespace TheOxbridgeApp.Views.Popups
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EventPopupView : PopupPage
    {

        public EventPopupView(Event selectedEvent)
        {
            InitializeComponent();
            this.BindingContext = new EventPopupViewModel(selectedEvent);
        }
    }
}