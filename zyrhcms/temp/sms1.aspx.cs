using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Runtime.InteropServices;

public partial class test_sms1 : System.Web.UI.Page
{
    //private const string strDir = @"E:\DOTNET\ASP.NET\projects\zyrhcms\zyrhcms\Bin\";
    private const string strDir = @"E:\web\zyrhweb\Bin\";

    [DllImport(strDir + "WESmsInterface.dll", EntryPoint = "OpenDevice")]
    private static extern IntPtr OpenDevice(Int32 nPort, Int32 nBaud);

    [DllImport(strDir + "WESmsInterface.dll", EntryPoint = "SendSMS")]
    private static extern Boolean SendSMS(IntPtr dev, string szNumber, string szContext);

    [DllImport(strDir + "WESmsInterface.dll", EntryPoint = "RecvSMS")]
    private static extern Boolean RecvSMS(IntPtr dev, ref IntPtr pMsg, ref Int32 nCount);

    [DllImport(strDir + "WESmsInterface.dll", EntryPoint = "CloseDevice")]
    private static extern Boolean CloseDevice(IntPtr dev);

    [DllImport(strDir + "WESmsInterface.dll", EntryPoint = "DismemberedSMS")]
    private static extern Boolean DismemberedSMS(IntPtr dev, int nIndex, StringBuilder szNumber, StringBuilder szTime, StringBuilder szContext);

    IntPtr pDev = IntPtr.Zero;

    protected void Page_Load(object sender, EventArgs e)
    {
        //Response.Write(Server.MapPath(Config.GetRootDir()));
    }

    private void Run()
    {
        try
        {
            int nCom = Convert.ToInt32(ddlCom.SelectedValue.Trim());
            int nBaud = Convert.ToInt32(ddlBaud.SelectedValue.Trim());
            pDev = OpenDevice(nCom, nBaud);
            if (pDev == IntPtr.Zero)
            {
                Response.Write("启动失败.");

            }
            else
            {
                btnRun.Enabled = false;
                btnStop.Enabled = true;
            }
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

    protected void btnRun_Click(object sender, EventArgs e)
    {
        Run();
    }

    protected void btnSend_Click(object sender, EventArgs e)
    {
        try
        {
            if (pDev != IntPtr.Zero)
            {
                SendSMS(pDev, this.txtPhoneNumber.Text.ToString(), this.txtSmsContent.Text.ToString());
            }
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

}