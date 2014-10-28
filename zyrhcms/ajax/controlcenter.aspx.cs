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
using System.Xml;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
//using WuhanWS;

public enum WorkPlanType
{
    JCW_接触网 = 1,
    BD_变电 = 2,
    DL_电力 = 3,
}

public partial class ajax_controlcenter : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int id = 0;
    protected string strIndexCode = string.Empty;
    protected string strDeptIndexCode = string.Empty;
    protected string strTypeCode = string.Empty;
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;
    protected string strWorkGrade = string.Empty;
    protected string strWorkType = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 0;

    protected Hashtable htWebServiceParamCode = new Hashtable();

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        //if (!IsPostBack)
        //{
        //    this.InitialData();
        //}
    }

    //protected void InitialData()
    //{
    //    this.strAction = Public.RequestString("action");

    //    switch (strAction)
    //    {
    //        case "getWorkPlan":
    //            this.strTypeCode = Public.RequestString("type");
    //            this.strStartTime = Public.RequestString("startTime");
    //            this.strEndTime = Public.RequestString("endTime");
    //            this.strWorkGrade = Public.RequestString("workGrade");
    //            this.strWorkType = Public.RequestString("workType");
    //            this.strDeptIndexCode = Public.RequestString("detpIndexCode");
    //            Response.Write(this.GetWorkPlan(this.strTypeCode, this.strStartTime, this.strEndTime, this.strDeptIndexCode, this.strWorkType, this.strWorkGrade));
    //            break;
    //        case "getDutyPlan":
    //            this.strTypeCode = Public.RequestString("type");
    //            this.strStartTime = Public.RequestString("startTime");
    //            this.strEndTime = Public.RequestString("endTime");
    //            Response.Write(this.GetDutyPlan(this.strTypeCode, this.strStartTime, this.strEndTime));
    //            break;
    //        case "getPillarList":
    //            this.strIndexCode = Public.RequestString("indexCode");
    //            string strLineUpDownId = Public.RequestString("upDownId");
    //            string strRailLineIndexCode = Public.RequestString("lineIndexCode");
    //            string strKilometerPost = Public.RequestString("kilometerPost");
    //            Response.Write(this.GetPillarList(this.strIndexCode, strRailLineIndexCode, strLineUpDownId, strKilometerPost));
    //            break;
    //        case "getSupply":
    //            this.strDeptIndexCode = Public.RequestString("deptIndexCode");
    //            this.pageIndex = Public.RequestString("pageIndex", 0);
    //            this.pageSize = Public.RequestString("pageSize", 0);
    //            Response.Write(this.GetSupply(this.strDeptIndexCode, this.pageIndex, this.pageSize));
    //            break;
    //        default:
    //            Response.Write("ok");
    //            break;
    //    }
    //}

    //#region  获得今日施工计划
    //public string GetWorkPlan(string strType, string strStartTime, string strEndTime, string strDeptIndexCode, string strWorkType, string strWorkGrade)
    //{
    //    try
    //    {
    //        if (strStartTime.Equals(string.Empty))
    //        {
    //            strStartTime = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");
    //        }
    //        if (strEndTime.Equals(string.Empty))
    //        {
    //            strEndTime = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");
    //        }
    //        string strParamCode = "007";
    //        StringBuilder strParamContent = new StringBuilder();
    //        strParamContent.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
    //        strParamContent.Append("<Request>");
    //        strParamContent.Append("<TYPEID>" + strType + "</TYPEID>");
    //        strParamContent.Append("<BEGINDATE>" + strStartTime + "</BEGINDATE>");
    //        strParamContent.Append("<ENDDATE>" + strEndTime + "</ENDDATE>");
    //        strParamContent.Append("<DEPARTMENTID>" + strDeptIndexCode + "</DEPARTMENTID>");
    //        strParamContent.Append("<WORKBUILDTYPE>" + strWorkType + "</WORKBUILDTYPE>");
    //        strParamContent.Append("<WORKGRADE>" + strWorkGrade + "</WORKGRADE>");
    //        strParamContent.Append("</Request>");

    //        string[,] arrField ={
    //            {"PLANID", "id"},
    //            {"TYPEID", "typeId"},
    //            {"WORKTEAMID", "deptId"},
    //            {"WORKTEAMNAME", "deptName"},
    //            {"WORKCONTENT", "workContent"},
    //            {"WORKPLACE", "workPlace"},
    //            {"WORKBEGINDATE", "startTime"},
    //            {"WORKENDDATE", "endTime"},
    //            {"PLANSTATUS", "status"},
    //            {"LONGITUDE", "lng"},
    //            {"LATITUDE", "lat"},
    //            {"WORKBUILDTYPE", "workType"},
    //            {"WORKGRADE","workGrade"},
    //            {"ONCADRES","cadre"}
    //        };
    //        string strXml = new WuhanWS.WebService1().Process(strParamCode, strParamContent.ToString());

    //        XmlDocument xml = new XmlDocument();
    //        xml.LoadXml(strXml);

    //        XmlNode root = xml.SelectSingleNode("ROWSET");

    //        XmlNode result = root.SelectSingleNode("Result");
    //        XmlNode error = root.SelectSingleNode("Err");

    //        XmlNodeList nodeList = root.SelectNodes("ROW");

    //        StringBuilder strResult = new StringBuilder();
    //        StringBuilder strItem = new StringBuilder();
    //        string strContent = string.Empty;

    //        strResult.Append("{result:1");
    //        strResult.Append(String.Format(",today:'{0}'", DateTime.Now.ToString("yyyy-MM-dd")));
    //        strResult.Append(",wsResult:{");
    //        strResult.Append(String.Format("result:{0}", result.InnerXml.Equals(string.Empty) ? "''" : result.InnerText));
    //        strResult.Append(String.Format(",error:'{0}'", error.InnerXml.Equals(string.Empty) ? "" : Public.FilterJsonValue(error.InnerText)));
    //        strResult.Append("}");
    //        strResult.Append(",list:[");

    //        strResult.Append(this.ParseXmlItemContent(nodeList, arrField));

    //        strResult.Append("]");
    //        strResult.Append("}");

    //        return strResult.ToString();
    //    }
    //    catch (Exception ex)
    //    {
    //        return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
    //    }
    //}
    //#endregion

    //#region  获得值班跟班计划
    //public string GetDutyPlan(string strType, string strStartTime, string strEndTime)
    //{
    //    try
    //    {
    //        if (strStartTime.Equals(string.Empty))
    //        {
    //            strStartTime = DateTime.Now.ToString("yyyy-MM-dd 00:00:00");
    //        }
    //        if (strEndTime.Equals(string.Empty))
    //        {
    //            strEndTime = DateTime.Now.ToString("yyyy-MM-dd 23:59:59");
    //        }
    //        string strParamCode = "013";
    //        StringBuilder strParamContent = new StringBuilder();
    //        strParamContent.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
    //        strParamContent.Append("<Request>");
    //        strParamContent.Append("<BEGINDATE>" + strStartTime + "</BEGINDATE>");
    //        strParamContent.Append("<ENDDATE>" + strEndTime + "</ENDDATE>");
    //        strParamContent.Append("</Request>");

    //        string[,] arrField ={
    //            {"DUTYID", "id"},
    //            {"DUTYMODE", "typeId"},
    //            {"DUTYDATE", "workDate"},
    //            {"DUTYPLACE","workPlace"}
    //        };
    //        string strXml = new WuhanWS.WebService1().Process(strParamCode, strParamContent.ToString());

    //        XmlDocument xml = new XmlDocument();
    //        xml.LoadXml(strXml);

    //        XmlNode root = xml.SelectSingleNode("ROWSET");

    //        XmlNode result = root.SelectSingleNode("Result");
    //        XmlNode error = root.SelectSingleNode("Err");

    //        XmlNodeList nodeList = root.SelectNodes("ROW");

    //        StringBuilder strResult = new StringBuilder();
    //        StringBuilder strItem = new StringBuilder();
    //        string strContent = string.Empty;

    //        strResult.Append("{result:1");
    //        strResult.Append(String.Format(",today:'{0}'", DateTime.Now.ToString("yyyy-MM-dd")));
    //        strResult.Append(",wsResult:{");
    //        strResult.Append(String.Format("result:{0}", result.InnerXml.Equals(string.Empty) ? "''" : result.InnerText));
    //        strResult.Append(String.Format(",error:'{0}'", error.InnerXml.Equals(string.Empty) ? "" : Public.FilterJsonValue(error.InnerText)));
    //        strResult.Append("}");
    //        strResult.Append(",list:[");

    //        strResult.Append(this.ParseXmlItemContent(nodeList, arrField));

    //        strResult.Append("]");
    //        strResult.Append("}");

    //        return strResult.ToString();
    //    }
    //    catch (Exception ex)
    //    {
    //        return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
    //    }
    //}
    //#endregion

    //#region  获得支柱信息
    //public string GetPillarList(string strTensionLengthIndexCode, string strRailLineIndexCode, string strLineUpDownId, string strKilometer)
    //{
    //    try
    //    {
    //        string strParamCode = "006";
    //        StringBuilder strParamContent = new StringBuilder();
    //        strParamContent.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
    //        strParamContent.Append("<Request>");
    //        strParamContent.Append("<MDNUMBER>" + strTensionLengthIndexCode + "</MDNUMBER>");
    //        strParamContent.Append("<RAILLINEID>" + strRailLineIndexCode + "</RAILLINEID>");
    //        strParamContent.Append("<XBNUMBER>" + strLineUpDownId + "</XBNUMBER>");
    //        strParamContent.Append("<POLEKILOMETER>" + strKilometer + "</POLEKILOMETER>");
    //        strParamContent.Append("</Request>");

    //        string[,] arrField ={
    //            {"MDNUMBER", "pid"},
    //            {"POLENUMBER", "code"},
    //            {"POLENAME", "name"},
    //            {"LATITUDE", "lat"},
    //            {"LONGITUDE", "lng"},
    //            {"POLEKILOMETER", "kp"}
    //        };
    //        string strXml = new WuhanWS.WebService1().Process(strParamCode, strParamContent.ToString());

    //        XmlDocument xml = new XmlDocument();
    //        xml.LoadXml(strXml);

    //        XmlNode root = xml.SelectSingleNode("ROWSET");

    //        XmlNode result = root.SelectSingleNode("Result");
    //        XmlNode error = root.SelectSingleNode("Err");

    //        XmlNodeList nodeList = root.SelectNodes("ROW");

    //        StringBuilder strResult = new StringBuilder();
    //        StringBuilder strItem = new StringBuilder();
    //        string strContent = string.Empty;
    //        strResult.Append("{result:1");
    //        strResult.Append(",wsResult:{");
    //        strResult.Append(String.Format("result:{0}", result.InnerXml.Equals(string.Empty) ? "''" : result.InnerXml));
    //        strResult.Append(String.Format(",error:'{0}'", error.InnerXml.Equals(string.Empty) ? "" : Public.ReplaceSingleQuotes(error.InnerXml)));
    //        strResult.Append("}");
    //        strResult.Append(",list:[");

    //        strResult.Append(this.ParseXmlItemContent(nodeList, arrField));

    //        strResult.Append("]");
    //        strResult.Append("}");

    //        return strResult.ToString();
    //    }
    //    catch (Exception ex)
    //    {
    //        return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
    //    }
    //}
    //#endregion

    //#region  获得应急物资信息
    //public string GetSupply(string strDeptIndexCode, int pageIndex, int pageSize)
    //{
    //    try
    //    {
    //        string strParamCode = "010";
    //        StringBuilder strParamContent = new StringBuilder();
    //        strParamContent.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
    //        strParamContent.Append("<Request>");
    //        strParamContent.Append("<ID>" + strDeptIndexCode + "</ID>");
    //        strParamContent.Append("</Request>");

    //        string[,] arrField ={
    //            {"DEPARTMENTID", "deptId"},
    //            {"DEPARTNAME", "deptName"},
    //            {"TYPENAME", "typeName"},
    //            {"MATERIALCODE", "code"},
    //            {"MATERIALNAME", "name"},
    //            {"MODEL", "model"},
    //            {"UNIT", "unit"},
    //            {"STANDARDQUANTITY", "quantity"},
    //            {"ACTUALQUANTITY", "quantity1"},
    //            {"REMARK", "remark"}
    //        };
    //        string strXml = new WuhanWS.WebService1().Process(strParamCode, strParamContent.ToString());

    //        XmlDocument xml = new XmlDocument();
    //        xml.LoadXml(strXml);

    //        XmlNode root = xml.SelectSingleNode("ROWSET");

    //        XmlNode result = root.SelectSingleNode("Result");
    //        XmlNode error = root.SelectSingleNode("Err");

    //        XmlNodeList nodeList = root.SelectNodes("ROW");

    //        StringBuilder strResult = new StringBuilder();
    //        StringBuilder strItem = new StringBuilder();
    //        string strContent = string.Empty;
    //        strResult.Append("{result:1");
    //        strResult.Append(",wsResult:{");
    //        strResult.Append(String.Format("result:{0}", result.InnerXml.Equals(string.Empty) ? "''" : result.InnerXml));
    //        strResult.Append(String.Format(",error:'{0}'", error.InnerXml.Equals(string.Empty) ? "" : Public.ReplaceSingleQuotes(error.InnerXml)));
    //        strResult.Append("}");
    //        strResult.Append(",list:[");

    //        strResult.Append(this.ParseXmlItemContent(nodeList, arrField));

    //        strResult.Append("]");
    //        strResult.Append("}");

    //        return strResult.ToString();
    //    }
    //    catch (Exception ex)
    //    {
    //        return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
    //    }
    //}
    //#endregion


    //#region  解析XML内容列表
    //public string ParseXmlItemContent(XmlNodeList nodeList, string[,] arrField)
    //{
    //    try
    //    {
    //        StringBuilder strResult = new StringBuilder();
    //        StringBuilder strItem = new StringBuilder();
    //        string strContent = string.Empty;

    //        int n = 0;
    //        int c = arrField.Length / 2;
    //        foreach (XmlNode xn in nodeList)
    //        {
    //            try
    //            {
    //                int nc = xn.ChildNodes.Count;

    //                //清除内容
    //                strItem.Length = 0;

    //                strResult.Append(n++ > 0 ? "," : "");
    //                strResult.Append("{");
    //                XmlNode x;
    //                for (int i = 0; i < c; i++)
    //                {
    //                    if (i < nc)
    //                    {
    //                        x = xn.SelectSingleNode(arrField[i, 0]);
    //                        if (x == null)
    //                        {
    //                            strContent = string.Empty;
    //                        }
    //                        else
    //                        {
    //                            strContent = x.InnerXml.Replace("\n", "<br />");
    //                        }
    //                    }
    //                    else
    //                    {
    //                        strContent = string.Empty;
    //                    }
    //                    strItem.Append(i > 0 ? "," : "");
    //                    strItem.Append(String.Format("{0}:'{1}'", arrField[i, 1], strContent));
    //                }
    //                strItem.Append("}");

    //                strResult.Append(strItem.ToString());
    //            }
    //            catch (Exception exx) { }
    //        }

    //        return strResult.ToString();
    //    }
    //    catch (Exception ex) { throw (ex); }
    //}
    //#endregion

    //#region  解析XML内容

    //#endregion

}
