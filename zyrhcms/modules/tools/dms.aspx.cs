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

public partial class modules_tools_dms : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        try
        {
            string lat = this.TextBox1.Text.Trim();
            string lng = this.TextBox2.Text.Trim();

            if (!lat.Equals(string.Empty) && !lng.Equals(string.Empty))
            {
                if (lat.IndexOf('°') < 0)
                {
                    lat = GpsLatLng.LatLngConvertInteger(Convert.ToDouble(lat)).ToString();
                }
                if (lng.IndexOf('°') < 0)
                {
                    lng = GpsLatLng.LatLngConvertInteger(Convert.ToDouble(lng)).ToString();
                }
                this.TextBox3.Text = GpsLatLng.DMSConvertLatLng(lat, -1).ToString();
                this.TextBox4.Text = GpsLatLng.DMSConvertLatLng(lng, -1).ToString();
            }

            lat = this.TextBox3.Text.Trim();
            lng = this.TextBox4.Text.Trim();
            if (!lat.Equals(string.Empty) && !lng.Equals(string.Empty))
            {
                this.TextBox5.Text = GpsLatLng.LatLngConvertDMS(lat).ToString();
                this.TextBox6.Text = GpsLatLng.LatLngConvertDMS(lng).ToString();


                this.TextBox7.Text = GpsLatLng.LatLngConvertDMS(lat).ToString();
                this.TextBox8.Text = GpsLatLng.LatLngConvertDMS(lng).ToString();
            }
            this.Label1.Text = string.Empty;
        }
        catch (Exception ex)
        {
            this.Label1.Text = "错误：" + ex.Message;
        }

    }

    protected void Button2_Click(object sender, EventArgs e)
    {
        try
        {
            string lat = this.TextBox3.Text.Trim();
            string lng = this.TextBox4.Text.Trim();
            if (!lat.Equals(string.Empty) && !lng.Equals(string.Empty))
            {
                this.TextBox5.Text = GpsLatLng.LatLngConvertDMS(lat).ToString();
                this.TextBox6.Text = GpsLatLng.LatLngConvertDMS(lng).ToString();


                this.TextBox7.Text = GpsLatLng.LatLngConvertDMS(lat).ToString();
                this.TextBox8.Text = GpsLatLng.LatLngConvertDMS(lng).ToString();
            }
            this.Label1.Text = string.Empty;
        }
        catch (Exception ex)
        {
            this.Label1.Text = "错误：" + ex.Message;
        }
    }
}
