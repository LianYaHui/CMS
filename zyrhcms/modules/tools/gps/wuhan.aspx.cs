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
using System.Text;
using Zyrh.Common;

public partial class modules_tools_gps_wuhan : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnConvert_Click(object sender, EventArgs e)
    {
        try
        {
            StringBuilder strLatLng = new StringBuilder();
            StringBuilder strResult = new StringBuilder();
            string strSource = this.txtSource.Text.Trim().Replace("	", ",");
            string[] delimiter = { "\r\n" };
            string[] arrData = strSource.Split(delimiter, StringSplitOptions.None);
            int lineId = Convert.ToInt32(this.ddlLine.SelectedValue.ToString());
            bool isConvert = this.chbConvert.Checked;
            bool isRound = this.chbRound.Checked;
            int decimalLen = isRound ? Convert.ToInt32(this.txtLength.Text.Trim()) : 0;

            if (this.chbZhiYi.Checked)
            {
                foreach (string str in arrData)
                {
                    if (str.Equals(string.Empty)) continue;
                    string[] arrLatLng = str.Split(',');
                    strResult.Append(String.Format("insert into {0}(latitude,longitude,kilometer_post,name,line_id)values(", "zyrh_task_point"));
                    strLatLng.Append(String.Format("{0}, {1}, {2}, {3}, {4}\r\n", arrLatLng[0], this.ZhiYiLatLng(arrLatLng[1]), this.ZhiYiLatLng(arrLatLng[2]), arrLatLng[3], arrLatLng[4]));

                    strResult.Append(String.Format("'{0}','{1}','{2}','{3}','{4}'", this.ZhiYiLatLng(arrLatLng[1]), this.ZhiYiLatLng(arrLatLng[2]), arrLatLng[3], arrLatLng[4], lineId));
                    strResult.Append(");\r\n");
                }
            }
            else
            {
                foreach (string str in arrData)
                {
                    if (str.Equals(string.Empty)) continue;
                    string[] arrLatLng = str.Split(',');
                    strResult.Append(String.Format("insert into {0}(latitude,longitude,kilometer_post,name,line_id)values(", "zyrh_task_point"));

                    double latitude = isConvert ? GpsLatLng.DMSConvertLatLng(arrLatLng[1], 8) : Convert.ToDouble(arrLatLng[1]);
                    double longitude = isConvert ? GpsLatLng.DMSConvertLatLng(arrLatLng[2], 8) : Convert.ToDouble(arrLatLng[2]);
                    if (isRound)
                    {
                        latitude = Math.Round(latitude, decimalLen, MidpointRounding.AwayFromZero);
                        longitude = Math.Round(longitude, decimalLen, MidpointRounding.AwayFromZero);
                    }

                    //double latitude = GpsLatLng.LatLngConvertInteger(GpsLatLng.DMSConvertLatLng(arrLatLng[1]));
                    //double langitude = GpsLatLng.LatLngConvertInteger(GpsLatLng.DMSConvertLatLng(arrLatLng[2]));

                    strLatLng.Append(String.Format("{0}, {1}, {2}, {3}, {4}\r\n", arrLatLng[0], latitude, longitude, arrLatLng[3], arrLatLng[4]));

                    strResult.Append(String.Format("'{0}','{1}','{2}','{3}','{4}'", latitude, longitude, arrLatLng[3], arrLatLng[4], lineId));
                    strResult.Append(");\r\n");
                }
            }
            this.txtLatLng.Text = strLatLng.ToString();
            this.txtResult.Text = strResult.ToString();
        }
        catch (Exception ex)
        {
            this.lblPrompt.Text = "错误：" + ex.Message;
            this.txtLatLng.Text = "";
            this.txtResult.Text = "";
        }
    }

    public string ZhiYiLatLng(string strLatLng)
    {
        return strLatLng.Replace(".", "").Replace("°", ".").Replace("\"", "").Replace("'", "");
    }

}
