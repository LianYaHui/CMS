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

public partial class ajax_common : System.Web.UI.Page
{
    protected string strAction = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {

        Response.ContentType = "text/plain";

        this.strAction = Public.GetRequest("action", string.Empty);

        switch (this.strAction)
        {
            case "getDateTime":
                string strFormat = Public.RequestString("format");
                bool showWeedDay = Public.RequestString("showWeedDay").Equals("1");
                Response.Write(this.GetDateTime(strFormat, showWeedDay));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }

    private string GetDateTime(string strFormat, bool showWeedDay)
    {
        string strResult = string.Empty;
        if (!strFormat.Equals(string.Empty))
        {
            strResult = DateTime.Now.ToString(strFormat);
        }
        else
        {
            strResult = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
        if (showWeedDay)
        {
            strResult += " " + this.ConvertWeekDay(DateTime.Now.DayOfWeek.ToString());
        }
        return strResult;
    }

    #region  星期转换
    private string ConvertWeekDay(string strWeekDay)
    {
        string strResult = string.Empty;
        switch (strWeekDay)
        {
            case "Monday":
                strResult = "星期一";
                break;
            case "Tuesday":
                strResult = "星期二";
                break;
            case "Wednesday":
                strResult = "星期三";
                break;
            case "Thursday":
                strResult = "星期四";
                break;
            case "Friday":
                strResult = "星期五";
                break;
            case "Saturday":
                strResult = "星期六";
                break;
            case "Sunday":
                strResult = "星期日";
                break;
        }
        return strResult;
    }
    #endregion

}
