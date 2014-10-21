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
using Zyrh.Common;

public partial class tools_gps : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        string lat = this.TextBox1.Text.Trim();
        string lng = this.TextBox2.Text.Trim();

        this.TextBox3.Text = GpsLatLng.DMSConvertLatLng(lat, -1).ToString();
        this.TextBox4.Text = GpsLatLng.DMSConvertLatLng(lng, -1).ToString();

        this.TextBox5.Text = GpsLatLng.LatLngConvertDMS(this.TextBox3.Text.Trim()).ToString();
        this.TextBox6.Text = GpsLatLng.LatLngConvertDMS(this.TextBox4.Text.Trim()).ToString();


        this.TextBox7.Text = GpsLatLng.LatLngConvertDMS(this.TextBox3.Text.Trim()).ToString();
        this.TextBox8.Text = GpsLatLng.LatLngConvertDMS(this.TextBox4.Text.Trim()).ToString();
    }
}