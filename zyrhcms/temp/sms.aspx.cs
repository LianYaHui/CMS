using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class test_sms : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        try
        {
            string strData = this.TextBox1.Text.Trim();

            SmsSocketClient.ConnectServer();

            bool result = SmsSocketClient.SendProtocol(strData);

            this.TextBox2.Text = result.ToString();
        }
        catch (Exception ex)
        {
            this.TextBox2.Text = ex.Message;
        }
    }
}
