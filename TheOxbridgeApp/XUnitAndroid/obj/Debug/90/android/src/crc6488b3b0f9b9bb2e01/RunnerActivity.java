package crc6488b3b0f9b9bb2e01;


public abstract class RunnerActivity
	extends crc643f46942d9dd1fff9.FormsApplicationActivity
	implements
		mono.android.IGCUserPeer
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_onCreate:(Landroid/os/Bundle;)V:GetOnCreate_Landroid_os_Bundle_Handler\n" +
			"";
		mono.android.Runtime.register ("Xunit.Runners.UI.RunnerActivity, xunit.runner.devices", RunnerActivity.class, __md_methods);
	}


	public RunnerActivity ()
	{
		super ();
		if (getClass () == RunnerActivity.class)
			mono.android.TypeManager.Activate ("Xunit.Runners.UI.RunnerActivity, xunit.runner.devices", "", this, new java.lang.Object[] {  });
	}


	public void onCreate (android.os.Bundle p0)
	{
		n_onCreate (p0);
	}

	private native void n_onCreate (android.os.Bundle p0);

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}
