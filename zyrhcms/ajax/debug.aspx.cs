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
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_debug : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GprsDBConnectionString = Public.GprsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceSettingManage dsm = new DeviceSettingManage(Public.CmsDBConnectionString);

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int unitId = 0;
    protected int parentId = -1;
    protected string strDevCodeList = string.Empty;
    protected string strTypeCode = string.Empty;
    protected string strFunctionCode = string.Empty;
    protected string settingType = string.Empty;
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

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
        this.pageIndex = Public.RequestString("pageIndex", 0);
        this.pageSize = Public.RequestString("pageSize", 20);
        this.unitId = Public.RequestString("unitId", 0);

        ui = uc.GetLoginUserInfo();

        if (this.unitId == 0)
        {
            this.unitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getDeviceSettingLog":
                this.strDevCodeList = Public.RequestString("devCode", string.Empty);
                this.strTypeCode = Public.RequestString("typeCode", string.Empty);
                this.strFunctionCode = Public.RequestString("functionCode", string.Empty);
                this.settingType = Public.RequestString("settingType", string.Empty);
                int downStatus = Public.RequestString("downStatus", -1);
                int responseStatus = Public.RequestString("responseStatus", -1);
                this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                this.parentId = Public.RequestString("parentId", -1);

                Response.Write(this.GetDeviceSettingLog(this.unitId, this.strTypeCode, this.strDevCodeList, this.strFunctionCode, this.settingType, downStatus, responseStatus, this.strStartTime, this.strEndTime, ui.UserId, this.parentId, this.pageIndex, this.pageSize));
                break;
            case "getSingleSettingLog":
                int id = Public.RequestString("id", 0);
                Response.Write(this.GetSingleDeviceSetting(id));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }

    #region  获得设备设置记录
    protected string GetDeviceSettingLog(int unitId, string strTypeCode, string strDevCodeList, string strFunctionCodeList, string settingTypeList, 
        int downStatus, int responseStatus, string strStartTime, string strEndTime, int operatorId, int parentId, int pageIndex, int pageSize)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (strDevCodeList.Equals(string.Empty))
            {
                ControlUnitManage cum = new ControlUnitManage(this.DBConnectionString);

                string strControlUnitIdList = cum.GetControlUnitIdList(unitId);
                strDevCodeList = dm.GetDeviceIndexCode(strControlUnitIdList);
            }
            string strOperatorIdList = string.Empty;
            DBResultInfo dbResult = dsm.GetDeviceSettingLog(strTypeCode, strDevCodeList, strFunctionCode, downStatus, responseStatus, settingTypeList, strStartTime, strEndTime,
                -1, strOperatorIdList, parentId, -1, pageIndex * pageSize, pageSize);
            DataSet ds = dbResult.dsResult;
            

            int dataCount = 0;
            if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
            {
                dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
            }

            strResult.Append("{result:1");
            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.ToString().Replace("'", "’")));
            strResult.Append(String.Format(",dataCount:{0}", dataCount));
            strResult.Append(",list:[");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append(this.FillDeviceSetting(ds.Tables[0]));
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得单个设备设置记录
    protected string GetSingleDeviceSetting(int id)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();


            DBResultInfo dbResult = dsm.GetDeviceSettingLog(id);
            DataSet ds = dbResult.dsResult;

            strResult.Append("{result:1");
            strResult.Append(",list:[");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strResult.Append(this.FillDeviceSetting(ds.Tables[0]));
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  填充设备设置记录
    public string FillDeviceSetting(DataTable dt)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            int n = 0;
            foreach (DataRow dr in dt.Rows)
            {
                DeviceSettingInfo dsi = dsm.FillDeviceSettingInfo(dr);
                strResult.Append(n > 0 ? "," : "");
                strResult.Append("{");
                strResult.Append(String.Format("devCode:'{0}',devName:'{1}',typeCode:'{2}',id:'{3}'", dsi.DevCode, dsi.DevName, dsi.TypeCode, dsi.Id));
                strResult.Append(String.Format(",functionCode:'{0}',protocolContent:'{1}'", dsi.FunctionCode, dsi.ProtocolContent.Replace("\\", "\\\\").Replace("'", "\\\'").Replace("\r\n", "<br />")));
                strResult.Append(String.Format(",parameter:'{0}',timeout:'{1}',createTime:'{2}'", dsi.Parameter.Replace("\\", "\\\\").Replace("'", "\\\'"), dsi.Timeout, Public.ConvertDateTime(dsi.CreateTime)));
                strResult.Append(String.Format(",downStatus:'{0}',downTime:'{1}',responseStatus:'{2}',responseTime:'{3}'", dsi.DownStatus, Public.ConvertDateTime(dsi.DownTime), dsi.ResponseStatus, Public.ConvertDateTime(dsi.ResponseTime)));
                strResult.Append(String.Format(",responseContent:'{0}',errorCode:'{1}'", dsi.ResponseContent.Replace("'", "\\\'").Replace("\r\n", "<br />"), dsi.ErrorCode));
                strResult.Append(String.Format(",settingType:'{0}',enabled:'{1}',operatorId:'{2}',operatorIp:'{3}',operatorName:'{4}'", dsi.SettingType, dsi.Enabled, dsi.OperatorId, dsi.OperatorIp, dsi.OperatorName));
                strResult.Append(String.Format(",parentId:'{0}',childQuantity:'{1}'", dsi.ParentId, dsi.ChildQuantity));

                strResult.Append("}");
                n++;
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
