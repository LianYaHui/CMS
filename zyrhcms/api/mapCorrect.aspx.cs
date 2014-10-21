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

public partial class api_mapCorrect : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected string strLat = string.Empty;
    protected string strLng = string.Empty;
    protected int len = 6;
    protected string strContentType = "text";

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        this.strAction = Public.GetRequest("action", string.Empty);
        this.strLat = Public.GetRequest("lat", string.Empty);
        this.strLng = Public.GetRequest("lng", string.Empty);
        this.len = Public.GetRequest("len", 6);
        this.strContentType = Public.GetRequest("contentType", "text");

        if (!strAction.Equals(string.Empty) && !this.strLat.Equals(string.Empty) && !this.strLng.Equals(string.Empty))
        {
            Response.Write(this.EMapCorrect(this.strAction, this.strLat, this.strLng, this.len, this.strContentType));
        }
        else
        {
            Response.ContentType = "text/html";
            StringBuilder strResult = new StringBuilder();
            strResult.Append("<style type=\"text/css\">body{margin:0;padding:0;}p{margin:10px 0; padding:0;}h4{margin:0;padding:0;}</style>");
            strResult.Append("<div style=\"font-size:14px; background:#f1f1f1;margin:0; padding:10px;font-family:宋体,Arial,Verdana;line-height:1.5;\">");
            strResult.Append("<h4>谷歌地图经纬度纠偏校正</h4>");
            strResult.Append("<p>");
            strResult.Append(String.Format("{0}/api/mapCorrect.aspx", Public.CmsUrl));
            strResult.Append("<br />");
            strResult.Append(String.Format("参数:action=[offset|revert]&lat=[纬度值]&lng=[经度值]&len=[小数位数:默认为6位小数]&contentType=[输出内容格式：text|json|xml]", Public.CmsUrl));
            strResult.Append("</p>");
            strResult.Append("示例：");
            strResult.Append(String.Format("<p>{0}/api/mapCorrect.aspx?action={1}&lat={2}&lng={3}&len={4}&contentType={5}</p>",
                Public.CmsUrl, "offset", "30.12890833", "120.0224", 6, "text"));

            strResult.Append("<p>");
            strResult.Append("将正确的经纬度转换成偏移的经纬度：<br />");
            strResult.Append("30.12890833,120.0224 => 30.12651,120.027128");
            strResult.Append("</p>");
            strResult.Append("<p>");
            strResult.Append("将偏移的经纬度转换成正确的经纬度：<br />");
            strResult.Append("30.12651,120.027128 => 30.12890833,120.0224");
            strResult.Append("</p>");
            strResult.Append("</div>");

            Response.Write(strResult.ToString());
        }
    }

    protected string EMapCorrect(string strAction, string strLat, string strLng, int len, string strContentType)
    {
        try
        {
            MapCorrect mc = new MapCorrect(len);
            MapLatLng latLng = new MapLatLng();
            switch (strAction)
            {
                case "offset":
                    latLng = mc.Offset(Convert.ToDouble(strLat), Convert.ToDouble(strLng));
                    break;
                case "revert":
                    latLng = mc.Revert(Convert.ToDouble(strLat), Convert.ToDouble(strLng));
                    break;
            }

            StringBuilder strXml = new StringBuilder(); 
            switch (strContentType)
            {
                case "json":
                    strXml.Append(String.Format("{{lat:{0},lng:{1}}}", latLng.Lat, latLng.Lng));
                    break;
                case "xml":
                    Response.ContentType = "text/xml";
                    strXml.Append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>\r\n");
                    strXml.Append("<map>\r\n");
                    strXml.Append(String.Format("\t<lat>{0}</lat>\r\n\t<lng>{1}</lng>\r\n", latLng.Lat, latLng.Lng));
                    strXml.Append("</map>");
                    break;
                case "text":
                default:
                    strXml.Append(String.Format("{0},{1}", latLng.Lat, latLng.Lng));
                    break;
            }
            return strXml.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return "error:" + ex.Message;
        }
    }
    
}
