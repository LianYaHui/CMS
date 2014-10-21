using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.BLL.Server;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Server;

public partial class ajax_server : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserCenter uc = new UserCenter();
    protected string strAction = string.Empty;
    protected int lineId = 0;
    protected int typeId = 0;
    protected int serverId = 0;
    protected string strServerIpList = string.Empty;
    protected string strSuperAdminName = "admin";

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";
        if (!IsPostBack)
        {
            this.strAction = Public.GetRequest("action", string.Empty);
            this.InitialData();
        }
    }

    #region  初始化数据
    private void InitialData()
    {
        UserInfo ui = uc.GetLoginUserInfo();
        switch (this.strAction)
        {
            case "getServerLine":
                Response.Write(this.GetServerLine());
                break;
            case "getServerLineInfo":
                this.lineId = Public.RequestString("id", 0);
                Response.Write(this.GetSingleServerLine(this.lineId));
                break;
            case "addServerLine":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    ServerLineInfo lineAdd = new ServerLineInfo();
                    lineAdd.LineCode = Public.RequestString("lineCode", 0);
                    lineAdd.LineName = Public.RequestString("lineName");
                    lineAdd.SortOrder = Public.RequestString("sortOrder", 0);
                    lineAdd.IsDisplay = Public.RequestString("isDisplay", 1);
                    lineAdd.Remark = Public.RequestString("remark");
                    lineAdd.CreateTime = Public.GetDateTime();
                    lineAdd.UpdateTime = Public.GetDateTime();
                    Response.Write(this.AddServerLine(lineAdd));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能添加服务器线路\",\"error\":\"\"}");
                }
                break;
            case "editServerLine":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    ServerLineInfo lineEdit = new ServerLineInfo();
                    lineEdit.Id = Public.RequestString("id", 0);
                    lineEdit.LineCode = Public.RequestString("lineCode", 0);
                    lineEdit.LineName = Public.RequestString("lineName");
                    lineEdit.SortOrder = Public.RequestString("sortOrder", 0);
                    lineEdit.IsDisplay = Public.RequestString("isDisplay", 1);
                    lineEdit.Remark = Public.RequestString("remark");
                    lineEdit.UpdateTime = Public.GetDateTime();
                    Response.Write(this.EditServerLine(lineEdit));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能修改服务器线路\",\"error\":\"\"}");
                }
                break;
            case "deleteServerLine":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    string strLineIdList = Public.RequestString("lineIdList");
                    Response.Write(this.DeleteServerLine(strLineIdList));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能删除服务器线路\",\"error\":\"\"}");
                }
                break;
            case "getServerType":
                Response.Write(this.GetServerType());
                break;
            case "getServerList":
                this.typeId = Public.RequestString("typeId", 0);
                Response.Write(this.GetServerList(this.typeId));
                break;
            case "getServerInfo":
                this.serverId = Public.RequestString("serverId", 0);
                Response.Write(this.GetServerInfo(this.serverId));
                break;
            case "addServer":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    ServerInfo serverAdd = new ServerInfo();
                    serverAdd.TypeId = Public.RequestString("typeId", 0);
                    serverAdd.ServerLineId = Public.RequestString("serverLineId", 0);
                    serverAdd.ServerCode = Public.RequestString("serverCode");
                    serverAdd.ServerName = Public.RequestString("serverName");
                    serverAdd.ShareFlag = Public.RequestString("shareFlag", 1);
                    serverAdd.Remark = Public.RequestString("remark");
                    this.strServerIpList = Public.RequestString("serverIpList");
                    Response.Write(this.AddServerInfo(serverAdd, this.strServerIpList, ui.UserId));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能添加服务器信息\",\"error\":\"\"}");
                }
                break;
            case "editServer":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    ServerInfo serverEdit = new ServerInfo();
                    serverEdit.ServerId = Public.RequestString("serverId", 0);
                    serverEdit.TypeId = Public.RequestString("typeId", 0);
                    serverEdit.ServerLineId = Public.RequestString("serverLineId", 0);
                    serverEdit.ServerCode = Public.RequestString("serverCode");
                    serverEdit.ServerName = Public.RequestString("serverName");
                    serverEdit.ShareFlag = Public.RequestString("shareFlag", 1);
                    serverEdit.Remark = Public.RequestString("remark");
                    this.strServerIpList = Public.RequestString("serverIpList");
                    Response.Write(this.UpdateServerInfo(serverEdit, this.strServerIpList, ui.UserId));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能修改服务器信息\",\"error\":\"\"}");
                }
                break;
            case "deleteServer":
                if (ui.UserId == 1 || ui.UserName.Equals(strSuperAdminName))
                {
                    string strServerIdList = Public.RequestString("serverIdList");
                    Response.Write(this.DeleteServer(strServerIdList));
                }
                else
                {
                    Response.Write("{\"result\":0,\"msg\":\"无操作权限，只有系统管理员才能删除服务器信息\",\"error\":\"\"}");
                }
                break;
            default:
                Response.Write("ok");
                break;
        }
    }
    #endregion

    #region 获得登录线路
    private string GetServerLine()
    {
        try
        {
            StringBuilder strLine = new StringBuilder();
            ServerLineManage sm = new ServerLineManage(this.DBConnectionString);
            List<ServerLineInfo> lstLine = new List<ServerLineInfo>();
            DataSet ds = sm.GetServerLine();

            DataSet dsDev = sm.GetDeviceCountByLine();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ServerLineInfo info = sm.FillServerLineInfo(dr);
                    if (i++ > 0)
                    {
                        strLine.Append(",");
                    }

                    DataView dv = new DataView(dsDev.Tables[0], "id=" + info.Id, "", DataViewRowState.CurrentRows);
                    if (dv.Count > 0)
                    {
                        info.DeviceCount = DataConvert.ConvertValue(dv[0]["device_count"].ToString(), 0);
                    }

                    strLine.Append("{");
                    strLine.Append(String.Format("\"id\":{0},\"name\":\"{1}\",\"code\":\"{2}\",\"serverCount\":{3},\"deviceCount\":{4},\"remark\":\"{5}\",\"sortOrder\":{6},\"isDisplay\":{7}",
                        info.Id, info.LineName, info.LineCode, info.ServerCount, info.DeviceCount,
                        Public.FilterJsonValue(info.Remark), info.SortOrder, info.IsDisplay)
                    );
                    strLine.Append("}");
                }
                return String.Format("{{\"result\":1,\"list\":[{0}]}}", strLine);
            }
            return "{\"result\":0,\"msg\":\"没有找到服务器线路信息\",\"error\":\"\",\"list\":[]}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region 获得单个登录线路
    private string GetSingleServerLine(int serverLineId)
    {
        try
        {
            StringBuilder strLine = new StringBuilder();
            ServerLineManage sm = new ServerLineManage(this.DBConnectionString);
            DataSet ds = sm.GetSingleServerLineById(serverLineId);

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                ServerLineInfo info = sm.FillServerLineInfo(dr);
                strLine.Append("{");
                strLine.Append(String.Format("\"id\":{0},\"name\":\"{1}\",\"code\":\"{2}\",\"remark\":\"{3}\",\"sortOrder\":{4},\"isDisplay\":{5}",
                    info.Id, info.LineName, info.LineCode, Public.FilterJsonValue(info.Remark), info.SortOrder, info.IsDisplay));
                strLine.Append("}");

                return String.Format("{{\"result\":1,\"line\":{0}}}", strLine);
            }
            return "{\"result\":0,\"msg\":\"没有找到服务器线路信息\",\"error\":\"\",\"list\":[]}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加线路信息
    public string AddServerLine(ServerLineInfo info)
    {
        try
        {
            ServerLineManage slm = new ServerLineManage(this.DBConnectionString);
            int count = slm.CheckServerLineCodeIsExist(info.LineCode);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同编号的线路信息。");
            }
            count = slm.CheckServerLineNameIsExist(info.LineName);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同名称的线路信息。");
            }
            int result = slm.AddServerLine(info);

            if (result > 0)
            {                
                return String.Format("{{\"result\":1}}");
            }
            return String.Format("{{\"result\":0, msg:'添加线路信息失败，请稍候再试。\",\"error\":\"\"}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  修改线路信息
    public string EditServerLine(ServerLineInfo info)
    {
        try
        {
            ServerLineManage slm = new ServerLineManage(this.DBConnectionString);
            //先检测是否有重名的线路信息
            int count = slm.CheckServerLineCodeIsExist(info.LineCode, info.Id);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同编号的线路信息。");
            }
            count = slm.CheckServerLineNameIsExist(info.LineName, info.Id);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同名称的线路信息。");
            }

            int result = slm.UpdateServerLine(info);

            if (result > 0)
            {
                return String.Format("{{\"result\":1}}");
            }
            return String.Format("{{\"result\":0,\"msg\":\"修改线路信息失败，请稍候再试。\",\"error\":\"\"}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  删除线路信息
    public string DeleteServerLine(int id)
    {
        try
        {
            ServerLineManage slm = new ServerLineManage(this.DBConnectionString);
            //先检测相关线路服务器IP信息
            int serverCount = slm.GetServerCountByLine(id);
            if (serverCount > 0)
            {
                return String.Format("{{\"result\":-3,\"msg\":\"{0}\",\"error\":\"\"}}", String.Format("线路下有{0}个服务器信息，请先删除相关服务器信息。", serverCount));
            }
            int deviceCount = slm.GetDeviceCountByLine(id);
            if (deviceCount > 0)
            {
                return String.Format("{{\"result\":-3,\"msg\":\"{0}\",\"error\":\"\"}}", String.Format("线路下有{0}个设备信息，请先删除相关设备信息。", deviceCount));
            }

            int result = slm.DeleteServerLine(id);

            if (result > 0)
            {
                return String.Format("{{\"result\":1}}");
            }
            return String.Format("{{\"result\":0,\"msg\":\"删除服务器线路失败。\",\"error\":\"\"}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    public string DeleteServerLine(string strLineIdList)
    {
        try
        {
            ServerLineManage slm = new ServerLineManage(this.DBConnectionString);
            //先检测相关线路服务器IP信息
            int serverCount = slm.GetServerCountByLine(strLineIdList);
            if (serverCount > 0)
            {
                return String.Format("{{\"result\":-3,\"msg\":\"{0}\",\"error\":\"\"}}", String.Format("线路下有{0}个服务器信息，请先删除相关服务器信息。", serverCount));
            }
            int deviceCount = slm.GetDeviceCountByLine(strLineIdList);
            if (deviceCount > 0)
            {
                return String.Format("{{\"result\":-3,\"msg\":\"{0}\",\"error\":\"\"}}", String.Format("线路下有{0}个设备信息，请先删除相关设备信息。", deviceCount));
            }

            int result = slm.DeleteServerLine(strLineIdList);

            if (result > 0)
            {
                return String.Format("{{\"result\":1}}");
            }
            return String.Format("{{\"result\":0,\"msg\":\"删除服务器线路失败。\",\"error\":\"\"}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
    

    #region 获得服务器类型
    private string GetServerType()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            ServerManage sm = new ServerManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetServerType();

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ServerTypeInfo st = sm.FillServerTypeInfo(dr);
                    if (i++ > 0)
                    {
                        strResult.Append(",");
                    }
                    strResult.Append("{");
                    strResult.Append(String.Format("\"typeId\":{0},\"typeName\":\"{1}\",\"typeCode\":\"{2}\"", st.TypeId, st.TypeName, st.TypeCode));
                    strResult.Append("}");
                }

                return String.Format("{{\"result\":1,\"list\":[{0}]}}", strResult);
            }
            return "{\"result\":0,\"msg\":\"没有找到服务器类型信息\",\"error\":\"\",\"list\":[]}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region 获得服务器信息
    private string GetServerList(int typeId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            ServerManage sm = new ServerManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetServerInfo(typeId, -1, string.Empty);

            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int i = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ServerInfo info = sm.FillServerInfo(dr);
                    if (i++ > 0)
                    {
                        strResult.Append(",");
                    }
                    strResult.Append("{");
                    strResult.Append(String.Format("\"serverId\":{0},\"typeId\":{1},\"serverCode\":\"{2}\",\"serverName\":\"{3}\"",
                        info.ServerId, info.TypeId, info.ServerCode, info.ServerName));
                    strResult.Append(String.Format(",\"typeCode\":\"{0}\",\"typeName\":\"{1}\",\"serverIp\":\"{2}\",\"serverPort\":{3}",
                        info.ServerType.TypeCode, info.ServerType.TypeName, info.ServerIp, info.ServerPort));
                    strResult.Append(String.Format(",\"remark\":\"{0}\",\"operatorId\":{1},\"createTime\":\"{2}\",\"deviceCount\":{3}",
                       Public.FilterJsonValue(info.Remark), info.OperatorId, info.CreateTime, info.DeviceCount));

                    strResult.Append("}");
                }

                return String.Format("{{\"result\":1,\"list\":[{0}]}}", strResult);
            }
            return "{\"result\":0,\"msg\":\"没有找到服务器信息。\",\"error\":\"\",\"list\":[]}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region 获得单个服务器信息
    private string GetServerInfo(int serverId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            StringBuilder strIp = new StringBuilder();
            ServerManage sm = new ServerManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetServerInfo(-1, serverId, string.Empty);
            DBResultInfo dbResultIp = sm.GetServerIpList(serverId);

            DataSet ds = dbResult.dsResult;
            DataSet dsIp = dbResultIp.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];

                ServerInfo info = sm.FillServerInfo(dr);

                strResult.Append("{");
                strResult.Append(String.Format("\"serverId\":{0},\"typeId\":{1},\"serverCode\":\"{2}\",\"serverName\":\"{3}\"",
                    info.ServerId, info.TypeId, info.ServerCode, info.ServerName));
                strResult.Append(String.Format(",\"typeCode\":\"{0}\",\"typeName\":\"{1}\",\"serverIp\":\"{2}\",\"serverPort\":{3}",
                    info.ServerType.TypeCode, info.ServerType.TypeName, info.ServerIp, info.ServerPort));
                strResult.Append(String.Format(",\"remark\":\"{0}\",\"operatorId\":{1},\"createTime\":\"{2}\",\"deviceCount\":{3}",
                       Public.FilterJsonValue(info.Remark), info.OperatorId, info.CreateTime, info.DeviceCount));
                strResult.Append("}");

                if (dsIp != null && dsIp.Tables[0] != null && dsIp.Tables[0].Rows.Count > 0)
                {
                    int n = 0;
                    foreach (DataRow drIp in dsIp.Tables[0].Rows)
                    {
                        ServerIpInfo sip = sm.FillServerIpInfo(drIp);
                        strIp.Append(n++ > 0 ? "," : "");
                        strIp.Append("{");
                        strIp.Append(String.Format("\"id\":\"{0}\",\"lineId\":\"{1}\",\"serverId\":\"{2}\",\"serverIp\":\"{3}\",\"serverPort\":\"{4}\",\"operatorId\":\"{5}\"",
                            sip.Id, sip.ServerLineId, sip.ServerId, sip.ServerIp, sip.ServerPort, sip.OperatorId));
                        strIp.Append("}");
                    }
                }

                return String.Format("{{\"result\":1,\"server\":{0},\"iplist\":[{1}]}}", strResult, strIp);
            }
            return "{\"result\":0,\"msg\":\"没有找到相关的服务器信息\",\"error\":\"\",server:{}}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加服务器信息
    public string AddServerInfo(ServerInfo info, string strServerIpList, int userId)
    {
        try
        {
            ServerManage sm = new ServerManage(this.DBConnectionString);

            //先检测是否有重名的服务器信息
            int count = sm.CheckServerCodeIsExist(info.ServerCode);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"msg\":\"{0}\",\"error\":\"\"}}", "已存在相同编号的服务器信息。");
            }
            count = sm.CheckServerNameIsExist(info.ServerName);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"msg\":\"{0}\",\"error\":\"\"}}", "已存在相同名称的服务器信息。");
            }

            info.CreateTime = Public.GetDateTime();
            info.UpdateTime = Public.GetDateTime();

            ArrayList arrDefaultIp = this.GetServerDefaultIp(strServerIpList);
            info.ServerIp = arrDefaultIp[0].ToString();
            info.ServerPort = Convert.ToInt32(arrDefaultIp[1]);
            
            DBResultInfo dbResult = sm.AddServerInfo(info);
            int serverId = dbResult.iResult;

            if (serverId > 0)
            {
                List<ServerIpInfo> lstServerIp = this.ParseServerIp(serverId, strServerIpList, userId);
                int[] isExist = this.CheckServerIpIsExist(lstServerIp);
                if (isExist[0] > 0)
                {
                    return String.Format("{{\"result\":-5,\"lineId\":{0},\"serverId\":{1},\"error\":\"{2}\"}}", isExist[1], serverId, "已存在相同的IP地址和端口");
                }
                sm.UpdateServerIpList(lstServerIp);

                return "{\"result\":1}";
            }
            else
            {
                return "{\"result\":0,\"msg\":\"添加服务器信息失败。\",\"error\":\"\"}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
    
    #region  修改服务器信息
    public string UpdateServerInfo(ServerInfo info, string strServerIpList, int userId)
    {
        try
        {
            ServerManage sm = new ServerManage(this.DBConnectionString);

            //先检测是否有重名的服务器信息
            int count = sm.CheckServerNameIsExist(info.ServerCode, info.ServerId);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同编号的服务器信息。");
            }
            count = sm.CheckServerNameIsExist(info.ServerName, info.ServerId);
            if (count > 0)
            {
                return String.Format("{{\"result\":-2,\"error\":\"{0}\"}}", "已存在相同名称的服务器信息。");
            }

            info.UpdateTime = Public.GetDateTime();

            ArrayList arrDefaultIp = this.GetServerDefaultIp(strServerIpList);
            info.ServerIp = arrDefaultIp[0].ToString();
            info.ServerPort = Convert.ToInt32(arrDefaultIp[1]);

            DBResultInfo dbResult = sm.UpdateServerInfo(info);
            int serverId = info.ServerId;
            int result = dbResult.iResult;

            if (result > 0)
            {

                List<ServerIpInfo> lstServerIp = this.ParseServerIp(serverId, strServerIpList, userId);

                int[] isExist = this.CheckServerIpIsExist(lstServerIp);
                if (isExist[0] > 0)
                {
                    return String.Format("{{\"result\":-5,\"lineId\":{0},\"error\":\"{1}\"}}", isExist[1], "已存在相同的IP地址和端口");
                }
                dbResult = sm.UpdateServerIpList(lstServerIp);

                return "{\"result\":1}";
            }
            else
            {
                return "{\"result\":0,\"msg\":\"修改服务器信息失败\",\"error\":\"\"}";
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得服务器当前线路IP信息
    public ArrayList GetServerDefaultIp(string strServerIpList)
    {
        ArrayList arrResult = new ArrayList();
        string[] arrIpList = strServerIpList.Split('|');
        foreach (string str in arrIpList)
        {
            string[] arrIp = str.Split(',');
            if (!arrIp[2].Equals(string.Empty))
            {
                arrResult.Add(arrIp[2]);
                arrResult.Add(arrIp[3]);
                break;
            }
        }
        return arrResult;
    }
    #endregion

    #region  删除服务器信息
    public string DeleteServer(string strServerIdList)
    {
        try
        {
            ServerManage sm = new ServerManage(this.DBConnectionString);

            //先检测相关服务器设备信息
            int devCount = sm.GetServerDeviceCount(strServerIdList);
            if (devCount > 0)
            {
                return String.Format("{{\"result\":-3,\"msg\":\"{0}\",\"error\":\"\"}}", String.Format("服务器下有{0}个设备信息，请先删除相关设备信息。", devCount));
            }

            int result = sm.DeleteServerInfo(strServerIdList);

            if (result > 0)
            {
                ///删除服务器线路IP配置
                sm.DeleteServerIpList(-1, strServerIdList, string.Empty);

                return String.Format("{{\"result\":1}}");
            }
            return String.Format("{{\"result\":0,\"msg\":\"删除服务器信息失败\",\"error\":\"\"}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{\"result\":-1,\"msg\":\"{0}\",\"error\":\"{1}\"}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  解析服务器线路IP
    public List<ServerIpInfo> ParseServerIp(int serverId, string strServerIpList, int userId)
    {
        List<ServerIpInfo> lstServerIp = new List<ServerIpInfo>();

        string[] arrIpList = strServerIpList.Split('|');
        foreach (string str in arrIpList)
        {
            string[] arrIp = str.Split(',');
            ServerIpInfo ip = new ServerIpInfo();
            ip.Id = DataConvert.ConvertValue(arrIp[0], 0);
            ip.ServerId = serverId;
            ip.ServerLineId = DataConvert.ConvertValue(arrIp[1], 0);
            ip.ServerIp = arrIp[2];
            ip.ServerPort = DataConvert.ConvertValue(arrIp[3], 0);
            ip.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            ip.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            ip.OperatorId = userId;

            lstServerIp.Add(ip);
        }

        return lstServerIp;
    }
    #endregion

    #region  服务器线路IP是否重复
    public int[] CheckServerIpIsExist(List<ServerIpInfo> lstServerIp)
    {
        try
        {
            int[] result = { 0, 0 };
            ServerManage sm = new ServerManage(this.DBConnectionString);

            foreach (ServerIpInfo si in lstServerIp)
            {
                if (si.Id == 0)
                {
                    if (sm.CheckServerIpIsExist(si.ServerIp, si.ServerPort, -1) > 0)
                    {
                        //添加时有重复
                        result[0]++;
                        if (result[1] == 0)
                        {
                            result[1] = si.ServerLineId;
                        }
                    }
                }
                else if (si.Id > 0 && si.ServerIp.Equals(string.Empty) && si.ServerPort <= 0)
                {
                    //删除不受限制
                }
                else
                {
                    if (sm.CheckServerIpIsExist(si.ServerIp, si.ServerPort, si.Id, si.ServerId, -1) > 0)
                    {
                        //修改
                        result[0]++;
                        if (result[1] == 0)
                        {
                            result[1] = si.ServerLineId;
                        }
                    }
                }
            }

            return result;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}
