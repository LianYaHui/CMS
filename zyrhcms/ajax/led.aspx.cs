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
using Zyrh.DAL;
using Zyrh.DAL.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.BLL.Led;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Led;

public partial class ajax_led : System.Web.UI.Page
{
    protected InfoManage im = new InfoManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected string strAction = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        try
        {
            this.strAction = Public.RequestString("action", string.Empty);
            if (Config.ValidateRequestType() && !this.strAction.Equals(string.Empty))
            {
                if (!this.Request.RequestType.Equals("POST"))
                {
                    Response.Write("RequestType Error");
                    Response.End();
                }
            }
            if (Config.ValidateUrlReferrer() && !strAction.Equals(string.Empty))
            {
                if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
                {
                    Response.Write("UrlReferrer Error");
                    Response.End();
                }
            }
            if (!uc.CheckUserLogin() && !this.strAction.Equals(string.Empty))
            {
                Response.Write("{result:-1, msg:'您还没有登录或登录已超时。', error:'noauth'}");
                Response.End();
            }

            switch (this.strAction)
            {
                case "getInfoType":
                    Response.Write(this.GetInfoType(
                        Public.RequestString("enabled", 1),
                        Public.RequestString("level", -1),
                        Public.RequestString("parentId", -1)
                        ));
                    break;
                case "getSignalLevel":
                    Response.Write(this.GetSignalLevel(
                        Public.RequestString("enabled", 1)
                        ));
                    break;
                case "getTypeSignal":
                    Response.Write(this.GetTypeSignal(Public.RequestString("typeId", 0)));
                    break;
                case "getTypeDefaultMemory":
                    Response.Write(this.GetTypeDefaultMemory(Public.RequestString("typeId", 0)));
                    break;
                case "addLedInfo":
                    LedScreenInfo info = new LedScreenInfo();
                    info.TypeId = Public.RequestString("typeId", 0);
                    info.SignalId = Public.RequestString("signalId", 0);
                    info.InfoContent = Public.RequestString("infoContent");
                    info.Indent = Public.RequestString("indent", 4);
                    info.MemoryNumber = Public.RequestString("memoryNumber", 0);
                    info.IsTiming = Public.RequestString("isTiming", 0);
                    info.TimeLimit = Public.RequestString("timeLimit", 1);
                    info.EndTime = Public.RequestString("endTime");
                    if (info.IsTiming == 1)
                    {
                        info.StartTime = Public.RequestString("startTime");
                    }
                    else
                    {
                        info.StartTime = Public.GetDateTime();
                    }
                    int validityHour = Public.RequestString("validityHour", 24);
                    if (info.EndTime.Equals(string.Empty))
                    {
                        info.EndTime = DateTime.Parse(info.StartTime).AddHours(validityHour).ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    info.PlaySound = Public.RequestString("playSound", 0);
                    info.PlayTimes = Public.RequestString("playTimes", 1);
                    info.LightType = Public.RequestString("lightType", 0);
                    info.OperatorId = uc.GetLoginUserInfo().UserId;
                    info.CreateTime = Public.GetDateTime();
                    
                    Response.Write(this.AddLedInfo(info, Public.RequestString("devCodeList")));
                    break;
                case "updateInfoStatus":
                    Response.Write(this.UpdateInfoStatus(
                        Public.RequestString("id", 0),
                        Public.RequestString("status", 0),
                        Public.RequestString("pwd")
                        ));
                    break;
                case "updateDeviceInfoStatus":
                    Response.Write(this.UpdateDeviceInfoStatus(
                        Public.RequestString("id", 0),
                        Public.RequestString("infoId", 0),
                        Public.RequestString("status", 0),
                        Public.RequestString("devCodeList"),
                        Public.RequestString("pwd")
                        ));
                    break;
                default:
                    Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                    break;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current.Request);
            Response.Write(String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current)));
        }
    }

    #region  获得信息类型
    public string GetInfoType(int enabled, int level, int parentId)
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetInfoType(enabled, level, parentId);
            DataSet ds = dbResult.dsResult;
            StringBuilder strResult = new StringBuilder();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                ///获得应急信息分类ID
                int typeId = LedInfoType.Emergency.GetHashCode();
                ///如果不是发布应急信息，则隐藏应急信息分类
                string strFilter = parentId != typeId ? String.Format(" parent_tree not like '%({0})%' ",typeId) : "";

                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);
                int n = 0;
                foreach (DataRowView dr in dv)
                {
                    InfoTypeInfo info = tm.FillInfoTypeInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},pid:{1},level:{2},name:'{3}'", info.TypeId, info.ParentId, info.Level, info.TypeName));
                    strResult.Append("}");
                }
            }

            return String.Format("{{result:1,list:[{0}]}}", strResult.ToString());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得信号级别
    public string GetSignalLevel(int enabled)
    {
        try
        {
            SignalLevelManage tm = new SignalLevelManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetSignalLevel(enabled);
            DataSet ds = dbResult.dsResult;
            StringBuilder strResult = new StringBuilder();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SignalLevelInfo info = tm.FillSignalLevelInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}',desc:'{3}'", 
                        info.SignalId, info.SignalCode, info.SignalName, info.SignalDesc));
                    strResult.Append("}");
                }
            }

            return String.Format("{{result:1,list:[{0}]}}", strResult.ToString());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  获得分类信号
    public string GetTypeSignal(int typeId)
    {
        try
        {
            TypeSignalManage tm = new TypeSignalManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetInfoTypeSignal(typeId, -1);
            DataSet ds = dbResult.dsResult;
            StringBuilder strResult = new StringBuilder();

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    TypeSignalInfo info = tm.FillTypeSignalInfo(dr);
                    strResult.Append(n++ > 0 ? "," : "");
                    strResult.Append("{");
                    strResult.Append(String.Format("id:{0},typeId:{1},signalId:{2},signalName:'{3}',signalDesc:'{4}',defenseGuidelines:'{5}',icon:'{6}'",
                        info.Id, info.TypeId, info.SignalId, info.SignalInfo.SignalName, Public.FilterJsonValue(info.SignalInfo.SignalDesc),
                        Public.FilterJsonValue(info.DefenseGuidelines), info.Icon));
                    strResult.Append(String.Format(",typeName:'{0}'", info.TypeInfo.TypeName));
                    strResult.Append("}");
                }
            }

            return String.Format("{{result:1,list:[{0}]}}", strResult.ToString());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得分类默认存储区位
    public string GetTypeDefaultMemory(int typeId)
    {
        try
        {
            InfoTypeConfigManage cm = new InfoTypeConfigManage(Public.CmsDBConnectionString);
            string strMemoryNumber = cm.GetMemoryNumberWithType(typeId);

            return String.Format("{{result:1,list:[{0}]}}", strMemoryNumber);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  发布LED信息
    public string AddLedInfo(LedScreenInfo info, string strDevCodeList)
    {
        try
        {
            InfoManage im = new InfoManage(Public.CmsDBConnectionString);
            InfoDeviceManage dm = new InfoDeviceManage(Public.CmsDBConnectionString);
            string strSpace = "";
            for (int i = 0; i < info.Indent; i++)
            {
                strSpace += " ";
            }
            info.InfoContent = strSpace + info.InfoContent;

            DBResultInfo dbResult = im.AddLedScreenInfo(info);
            int infoId = dbResult.iResult;

            strDevCodeList = Zyrh.BLL.DataConvert.CheckStringList(strDevCodeList);

            //发送即时任务时 需要覆盖之前的即时任务，但不能覆盖预约的任务
            if (info.IsTiming == 0)
            {
                //覆盖设备信息
                dm.CoverDeviceInfo(strDevCodeList, info.MemoryNumber, info.IsTiming, LedScreenInfoStatus.Cover);
                //获得被覆盖的信息ID
                //根据信息ID 检测该信息相关的设备信息是否全部被覆盖，若全部被覆盖，则将信息的状态改为覆盖
                ArrayList arrId = dm.GetCoverInfoId(dm.GetCoverInfo(info.MemoryNumber, info.IsTiming));
                foreach (int id in arrId)
                {
                    im.UpdateInfoStatus(id, LedScreenInfoStatus.Cover);
                }
            }

            if (infoId > 0)
            {
                StringBuilder strSql = new StringBuilder();

                string[] arr = strDevCodeList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string str in arr)
                {
                    LedScreenInfoDevice dev = new LedScreenInfoDevice();
                    dev.DeviceIndexCode = str;
                    dev.InfoId = infoId;
                    dev.Status = info.InfoStatus;
                    dev.StatusTime = Public.GetDateTime();
                    dev.CreateTime = Public.GetDateTime();

                    strSql.Append(dm.BuildAddLedScreenInfoDeviceSql(dev));
                }

                if (strSql.Length > 0)
                {
                    dm.AddLedScreenInfoDevice(strSql.ToString());
                }

            }

            string strServerIp = Config.GetLedServerIp();
            int serverPort = Config.GetLedServerPort();
            //发送指令至LED服务器
            bool isSend = this.SendProtocolToServer(String.Format("TASK:{0}", infoId), strServerIp, serverPort);
            string strSendPrompt = isSend ? "发送成功" : "发送失败";

            LedScreenSendStatus sendStatus = isSend ? LedScreenSendStatus.Success: LedScreenSendStatus.Failed;
            //更新发送状态
            im.UpdateSendStatus(infoId, sendStatus);

            return String.Format("{{result:1, msg:'{0}'}}", String.Format("服务器({0}:{1}){2}", strServerIp, serverPort, strSendPrompt));
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion


    #region  更新信息状态
    public string UpdateInfoStatus(int infoId, int status, string strOperatorPwd)
    {
        try
        {
            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            int login = uc.UserLogin(ui, strOperatorPwd);
            if (login != 1)
            {
                return "{result:0,msg:'密码输入错误'}";
            }

            string strServerIp = Config.GetLedServerIp();
            int serverPort = Config.GetLedServerPort();

            InfoManage im = new InfoManage(Public.CmsDBConnectionString);
            InfoDeviceManage dm = new InfoDeviceManage(Public.CmsDBConnectionString);

            if (infoId > 0 && (status == 3 || status == 4))
            {
                LedScreenInfoStatus infoStatus = LedScreenInfoStatus.Validity;
                switch (status)
                {
                    case 3:
                        infoStatus = LedScreenInfoStatus.Cancel;
                        break;
                    case 4:
                        infoStatus = LedScreenInfoStatus.Deleted;
                        break;
                }
                im.UpdateInfoStatus(infoId, infoStatus);

                dm.UpdateInfoDeviceStatus(-1, infoId, string.Empty, infoStatus);
                
                //发送指令至LED服务器
                bool isSend = this.SendProtocolToServer(String.Format("DELTASK:{0}", infoId), strServerIp, serverPort);
                string strSendPrompt = isSend ? "发送成功" : "发送失败";

                return String.Format("{{result:1, msg:'{0}'}}", String.Format("服务器({0}:{1}){2}", strServerIp, serverPort, strSendPrompt));
            }

            return "{result:1, msg:''}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  更新设备信息状态
    public string UpdateDeviceInfoStatus(int id, int infoId, int status, string strDevCodeList, string strOperatorPwd)
    {
        try
        {
            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            int login = uc.UserLogin(ui, strOperatorPwd);
            if (login != 1)
            {
                //return "{result:0,msg:'密码输入错误'}";
            }

            string strServerIp = Config.GetLedServerIp();
            int serverPort = Config.GetLedServerPort();

            InfoManage im = new InfoManage(Public.CmsDBConnectionString);
            InfoDeviceManage dm = new InfoDeviceManage(Public.CmsDBConnectionString);

            if (infoId > 0 && (status == 3 || status == 4))
            {
                LedScreenInfoStatus infoStatus = LedScreenInfoStatus.Validity;
                switch (status)
                {
                    case 3:
                        infoStatus = LedScreenInfoStatus.Cancel;
                        break;
                    case 4:
                        infoStatus = LedScreenInfoStatus.Deleted;
                        break;
                }
                dm.UpdateInfoDeviceStatus(-1, infoId, strDevCodeList, infoStatus);

                //根据信息相关设备的状态判断信息应该是什么状态
                int devInfoStatus = dm.GetInfoStatus(dm.GetDeviceInfoStatusStat(infoId));
                switch (devInfoStatus)
                {
                    case 0:
                        infoStatus = LedScreenInfoStatus.Validity;
                        break;
                    case 2:
                        infoStatus = LedScreenInfoStatus.Cover;
                        break;
                    case 3:
                        infoStatus = LedScreenInfoStatus.Cancel;
                        break;
                    case 4:
                        infoStatus = LedScreenInfoStatus.Deleted;
                        break;
                    case 5:
                        infoStatus = LedScreenInfoStatus.Expire;
                        break;
                    default:
                        infoStatus = LedScreenInfoStatus.Validity;
                        break;
                }
                im.UpdateInfoStatus(infoId, infoStatus);
                
                //发送指令至LED服务器
                bool isSend = this.SendProtocolToServer(String.Format("DELTASK:{0}", infoId), strServerIp, serverPort);
                string strSendPrompt = isSend ? "发送成功" : "发送失败";

                return String.Format("{{result:1, msg:'{0}'}}", String.Format("服务器({0}:{1}){2}", strServerIp, serverPort, strSendPrompt));
            }

            return "{result:1, msg:''}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion
   

    #region  发送指令至服务器
    public bool SendProtocolToServer(string strProtocol, string strServerIp, int serverPort)
    {
        try
        {
            bool isSend = false;

            LedSocketClient.strServerIp = strServerIp;
            LedSocketClient.iServerPort = serverPort;

            LedSocketClient.ConnectServer();

            isSend = LedSocketClient.SendProtocol(strProtocol);

            return isSend;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}