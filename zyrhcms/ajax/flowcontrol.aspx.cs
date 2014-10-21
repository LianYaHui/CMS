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
using System.Text.RegularExpressions;
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;
using Zyrh.DBUtility;

public partial class ajax_flowcontrol : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int eventId = 0;
    protected string strName = string.Empty;
    protected string strContent = string.Empty;
    protected bool isIE = true;

    protected string strProfessionIdList = string.Empty;
    protected string strLineIdList = string.Empty;
    protected string strLevelIdList = string.Empty;
    protected string strKeywords = string.Empty;
    protected int finished = -1;
    protected int deleted = -1;
    protected int pageIndex = 0;
    protected int pageSize = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            try
            {
                this.strAction = Public.GetRequest("action", string.Empty);

                switch (this.strAction)
                {
                    case "getEvent":
                        this.finished = Public.RequestString("finished", 0);
                        Response.Write(this.GetEventList(this.strProfessionIdList, this.strLineIdList, this.strLevelIdList, this.finished, this.deleted, this.strKeywords, SearchTactics.And, this.pageIndex, this.pageSize));
                        break;
                    case "getSingleEvent":
                        this.eventId = Public.RequestString("eventId", 0);
                        Response.Write(this.GetSingleEventInfo(this.eventId));
                        break;
                    case "addEvent":
                        RailwayEventInfo eiAdd = new RailwayEventInfo();
                        eiAdd.EventId = Public.RequestString("eventId", 0);
                        eiAdd.ProfessionId = Public.RequestString("professionId", 0);
                        eiAdd.LineId = Public.RequestString("lineId", 0);
                        eiAdd.UpDownId = Public.RequestString("upDownId", 0);
                        eiAdd.KilometerPost = Public.RequestString("kilometerPost", 0.0f);
                        eiAdd.EventPlace = Public.RequestString("eventPlace");
                        eiAdd.SubstationIndexCode = Public.RequestString("substationIndexCode");
                        eiAdd.TensionLengthIndexCode = Public.RequestString("tensionLengthIndexCode");
                        eiAdd.LevelId = Public.RequestString("levelId", 0);
                        eiAdd.EventName = Public.RequestString("eventName");
                        eiAdd.EventDesc = Public.RequestString("eventDesc");
                        eiAdd.EventTime = Public.RequestString("eventTime");
                        eiAdd.CreateTime = Public.GetDateTime();
                        if (eiAdd.EventTime.Equals(string.Empty))
                        {
                            eiAdd.EventTime = eiAdd.CreateTime;
                        }

                        Response.Write(this.AddEvent(eiAdd));
                        break;
                    case "editEvent":
                        RailwayEventInfo eiEdit = new RailwayEventInfo();
                        eiEdit.EventId = Public.RequestString("eventId", 0);
                        eiEdit.ProfessionId = Public.RequestString("professionId", 0);
                        eiEdit.LineId = Public.RequestString("lineId", 0);
                        eiEdit.LevelId = Public.RequestString("levelId", 0);
                        eiEdit.EventName = Public.RequestString("eventName");
                        eiEdit.EventDesc = Public.RequestString("eventDesc");
                        eiEdit.UpdateTime = Public.GetDateTime();

                        Response.Write(this.UpdateEvent(eiEdit));
                        break;
                    case "saveEventReport":
                        this.eventId = Public.RequestString("eid", 0);
                        this.strName = Public.RequestString("name");
                        this.strContent = Public.RequestString("content");
                        Response.Write(this.SaveEventReport(this.eventId, this.strName, this.strContent));
                        break;
                    case "exportExcel":
                        this.eventId = Public.RequestString("eid", 0);
                        this.ExportExcel(this.eventId, this.isIE);
                        break;
                    case "exportWord":
                        this.eventId = Public.RequestString("eid", 0);
                        this.ExportWord(this.eventId, this.isIE);
                        break;
                    case "exportTxt":
                        this.eventId = Public.RequestString("eid", 0);
                        this.ExportTxt(this.eventId, this.isIE);
                        break;
                    default:
                        Response.Write("ok " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                        break;
                }
            }
            catch (Exception ex)
            {
                //Response.Write(ex.Message);
            }
        }
    }


    #region   获得事件信息
    public string GetEventList(string strProfessionIdList, string strLineIdList, string strLevelIdList, int finished, int deleted, 
        string strKeywords, SearchTactics st, int pageIndex, int pageSize)
    {
        try
        {
            RailwayEventManage evm = new RailwayEventManage(this.DBConnectionString);
            DBResultInfo dbResult = evm.GetEventInfo(strProfessionIdList, strLineIdList, strLevelIdList, finished, deleted, strKeywords, st, pageIndex, pageSize);
            DataSet ds = dbResult.dsResult;
            StringBuilder strResult = new StringBuilder();
            int dataCount = 0;
            strResult.Append("{result:1");
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayEventInfo ei = evm.FillEventInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("eventId:{0},professionId:{1},levelId:{2},finished:{3},deleted:{4},createTime:'{5}'",
                        ei.EventId, ei.ProfessionId, ei.LevelId, ei.Finished, ei.Deleted, ei.CreateTime));
                    strResult.Append(String.Format(",eventName:'{0}',eventDesc:'{1}',eventTime:'{2}'",
                        ei.EventName, Public.ReplaceSingleQuotes(ei.EventDesc), ei.EventTime));
                    strResult.Append(String.Format(",lineId:'{0}',upDownId:'{1}',kilometerPost:'{2}',eventPlace:{3}",
                        ei.LineId, ei.UpDownId, ei.KilometerPost, ei.EventPlace.Equals(string.Empty) ? "''" : Server.HtmlDecode(ei.EventPlace)));
                    strResult.Append(String.Format(",substationIndexCode:'{0}',tensionLengthIndexCode:'{1}'",
                        ei.SubstationIndexCode, ei.TensionLengthIndexCode));
                    strResult.Append(String.Format(",eventReport:'{0}',finishTime:'{1}'",
                        Server.HtmlDecode(Public.ReplaceSingleQuotes(ei.EventReport)), ei.FinishTime));
                    strResult.Append("}");
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得单个事件信息
    public string GetSingleEventInfo(int eventId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            RailwayEventManage evm = new RailwayEventManage(this.DBConnectionString);
            DBResultInfo dbResult = evm.GetEventInfo(eventId);

            DataSet ds = dbResult.dsResult;

            strResult.Append("{result:1");
            strResult.Append(",info:{");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                RailwayEventInfo ei = evm.FillEventInfo(dr);

                strResult.Append(String.Format("eventId:{0},professionId:{1},levelId:{2},finished:{3},deleted:{4},createTime:'{5}'",
                    ei.EventId, ei.ProfessionId, ei.LevelId, ei.Finished, ei.Deleted, ei.CreateTime));
                strResult.Append(String.Format(",eventName:'{0}',eventDesc:'{1}',eventTime:'{2}'",
                    ei.EventName, Public.ReplaceSingleQuotes(ei.EventDesc), ei.EventTime));
                strResult.Append(String.Format(",lineId:'{0}',upDownId:'{1}',kilometerPost:'{2}',eventPlace:{3}",
                    ei.LineId, ei.UpDownId, ei.KilometerPost, ei.EventPlace.Equals(string.Empty) ? "''" : Server.HtmlDecode(ei.EventPlace)));
                strResult.Append(String.Format(",substationIndexCode:'{0}',tensionLengthIndexCode:'{1}'",
                    ei.SubstationIndexCode, ei.TensionLengthIndexCode));
                strResult.Append(String.Format(",eventReport:'{0}',finishTime:'{1}'",
                    Server.HtmlDecode(Public.ReplaceSingleQuotes(ei.EventReport)), ei.FinishTime));
            }
            strResult.Append("}");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  创建事件
    public string AddEvent(RailwayEventInfo evInfo)
    {
        try
        {
            RailwayEventManage evm = new RailwayEventManage(this.DBConnectionString);

            DBResultInfo dbResult = evm.AddEventInfo(evInfo);
            return String.Format("{{result:{0}, eventId:{1}}}", dbResult.iResult > 0 ? 1 : 0, dbResult.iResult);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  修改事件
    public string UpdateEvent(RailwayEventInfo evInfo)
    {
        try
        {
            RailwayEventManage evm = new RailwayEventManage(this.DBConnectionString);

            DBResultInfo dbResult = evm.UpdateEventInfo(evInfo);
            return String.Format("{{result:{0}}}", dbResult.iResult > 0 ? 1 : 0);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  保存事件报告
    protected string SaveEventReport(int eventId, string strName, string strContent)
    {
        try
        {
            StringBuilder strSql = new StringBuilder();
            DataSet ds = this.GetEventContent(eventId);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strSql.Append(String.Format("update rp_event set event_report = '{0}',finished = 1 where event_id = {1};", strContent, eventId));
            }
            else
            {
                strSql.Append(String.Format("insert into rp_event(event_id,event_name,event_report,create_time)values({0},'{1}','{2}',now());",
                    eventId, strName, strContent));
            }
            int result = MySqlHelper.ExecuteNonQuery(this.DBConnectionString, strSql.ToString());


            return String.Format("{{result:{0}}}", result > 0 ? 1 : 0);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region   获得事件内容
    public DataSet GetEventContent(int eventId)
    {
        try
        {
            RailwayEventManage evm = new RailwayEventManage(this.DBConnectionString);
            DBResultInfo dbResult = evm.GetEventInfo(eventId);

            return dbResult.dsResult;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  导出Word文档
    protected void ExportWord(int eventId, bool isIE)
    {
        try
        {
            string strFileName = "";
            string strContent = "";

            DataSet ds = this.GetEventContent(eventId);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                strFileName = dr["event_name"].ToString();
                strContent = Server.HtmlDecode(dr["event_report"].ToString());
            }
            FileOperate.ExportWord(strFileName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  导出Excel文档
    protected void ExportExcel(int eventId, bool isIE)
    {
        try
        {
            string strFileName = "";
            string strSheetName = "";
            string strContent = "";

            DataSet ds = this.GetEventContent(eventId);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                strFileName = dr["event_name"].ToString();
                strContent = Server.HtmlDecode(dr["event_report"].ToString());
            }
            FileOperate.ExportExcel(strFileName, strSheetName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion
    
    #region  导出Txt文档
    protected void ExportTxt(int eventId, bool isIE)
    {
        try
        {
            string strFileName = "";
            string strContent = "";

            DataSet ds = this.GetEventContent(eventId);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                strFileName = dr["event_name"].ToString();
                strContent = Server.HtmlDecode(dr["event_report"].ToString());
                strContent = Regex.Replace(strContent, "</(p|div)>*?<(p|div)>", "\r\n\r\n", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                strContent = Regex.Replace(strContent, "<br( )*(/)?>", "\r\n", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                strContent = Regex.Replace(strContent, "</?(p|div)>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                strContent = Regex.Replace(strContent, "<[^>]*>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            }
            FileOperate.ExportTxt(strFileName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
