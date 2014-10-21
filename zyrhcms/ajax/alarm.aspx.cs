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
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_alarm : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected PresetConfigManage pcm = new PresetConfigManage(Public.CmsDBConnectionString);
    protected PictureAlarmManage pam = new PictureAlarmManage(Public.PicDBConnectionString);

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int channelNo = -1;
    protected int presetNo = -1;
    protected string strAlarmType = string.Empty;
    protected int minAlarmLevel = -1;
    protected int maxAlarmLevel = -1;
    protected bool showAlarmArea = false;
    protected int unitId = 0;
    protected string strDevTypeCode = string.Empty;
    protected string strDevCodeList = string.Empty;
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;
    protected int days = 0;
    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strDevCode = string.Empty;

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
            case "getPictureAlarmLog":
                this.strDevCodeList = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", -1);
                this.presetNo = Public.RequestString("presetNo", -1);
                this.strAlarmType = Public.RequestString("alarmType", string.Empty);
                this.minAlarmLevel = Public.RequestString("minAlarmLevel", -1);
                this.maxAlarmLevel = Public.RequestString("maxAlarmLevel", -1);
                this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                this.strFilter = Public.RequestString("filter", string.Empty);
                this.strKeywords = Public.RequestString("keywords", string.Empty);
                this.showAlarmArea = Public.RequestString("showArea", 0) == 1;
                Response.Write(this.GetPictureAlarmLog(this.unitId, this.strDevCodeList, this.channelNo, this.presetNo, this.strAlarmType, this.minAlarmLevel, this.maxAlarmLevel, this.strStartTime, this.strEndTime, this.strFilter, this.strKeywords, this.showAlarmArea, this.pageIndex, this.pageSize));
                break;
            case "getSingleAlarmLog":
                string strMonth = Public.RequestString("month", string.Empty);
                int id = Public.RequestString("id", 0);
                Response.Write(this.GetSingleAlarmInfo(strMonth, id));
                break;
            case "deletePictureAlarm":
                string strLogIdList = Public.RequestString("alarmIdList", string.Empty);
                Response.Write(this.DeletePictureAlarmLog(strLogIdList));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }

    }

    #region  获得单个报警记录
    public string GetSingleAlarmInfo(string strMonth, int id)
    {
        try
        {
            string strTableName = "picture_alarm_" + strMonth;
            DataSet ds = pam.GetSingleAlarm(strTableName, id);
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                PictureAlarmInfo pai = pam.FillPictureAlarm(dr);
                pai.AlarmMonth = strMonth;

                StringBuilder strAlarm = new StringBuilder();
                strAlarm.Append("{result:1");
                strAlarm.Append(String.Format(",alarmId:'{0}'", id));
                strAlarm.Append(String.Format(",alarmMonth:'{0}'", strMonth));
                strAlarm.Append(pai.AlarmInfo.Equals(string.Empty) ? ",alarmInfo:''" : String.Format(",alarmInfo:{0}", pai.AlarmInfo));
                strAlarm.Append(pai.AlarmArea.Equals(string.Empty) ? ",alarmArea:''" : String.Format(",alarmArea:{0}", pai.AlarmArea));
                strAlarm.Append("}");

                return strAlarm.ToString();
            }
            else
            {
                return String.Format("{{result:0,alarmId:'{0}',alarmInfo:''}}", id);
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得图片报警
    protected string GetPictureAlarmLog(int unitId, string strDevCodeList, int channelNo, int presetNo, string strAlarmTypeList, int minAlarmLevel, int maxAlarmLevel, string strStartTime, string strEndTime, string strFilter, string strKeywords, bool showAlarmArea, int pageIndex, int pageSize)
    {
        string strDevCode = strDevCodeList;
        StringBuilder strAlarm = new StringBuilder();
        try
        {

            DateTime dtStart = DateTime.Parse(strStartTime);
            DateTime dtEnd = DateTime.Parse(strEndTime);
            int months = dtEnd.Month - dtStart.Month;
            DBResultInfo dbResult = new DBResultInfo();

            ControlUnitManage unitm = new ControlUnitManage(this.DBConnectionString);
            dbResult = unitm.GetControlUnitChildId(unitId);

            DataSet dsUnitList = dbResult.dsResult;

            string strControlUnitIdList = string.Empty;
            if (dsUnitList != null && dsUnitList.Tables[0] != null && dsUnitList.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drUnit in dsUnitList.Tables[0].Rows)
                {
                    ControlUnitInfo cui = unitm.FillControlUnitId(drUnit);
                    strControlUnitIdList += "," + cui.UnitId;
                }
            }
            if (!strControlUnitIdList.Equals(string.Empty))
            {
                strControlUnitIdList = strControlUnitIdList.Substring(1);
            }

            if (strDevCodeList.Equals(string.Empty) && unitId > 0)
            {
                strDevCodeList = dm.GetDeviceIndexCode(strControlUnitIdList, strFilter, strKeywords);
                /*
                if (dsDevCode != null && dsDevCode.Tables[0] != null && dsDevCode.Tables[0].Rows.Count > 0)
                {
                    StringBuilder strDevList = new StringBuilder();
                    foreach (DataRow drDev in dsDevCode.Tables[0].Rows)
                    {
                        DeviceInfo di = dm.FillDeviceIndexCode(drDev);
                        strDevList.Append(",");
                        strDevList.Append(String.Format("'{0}'", di.DevCode));
                    }
                    if (strDevList.Length > 0)
                    {
                        strDevCodeList = strDevList.ToString().Substring(1);
                    }
                }
                */
            }
            if (!strKeywords.Equals(string.Empty) && strDevCodeList.Equals(string.Empty))
            {
                //没有搜索到相关的设备信息
                return "{result:1,dataCount:0,list:[]}";
            }
            int dataCount = pam.GetPictureAlarmTotal(strDevCodeList, channelNo, presetNo, strAlarmTypeList, minAlarmLevel, maxAlarmLevel, strStartTime, strEndTime, -1, -1, 0);

            List<PictureAlarmInfo> lstAlarm = pam.GetPictureAlarmInfoList(strDevCodeList, channelNo, presetNo, strAlarmTypeList, minAlarmLevel, maxAlarmLevel, strStartTime, strEndTime, -1, -1, 0, pageIndex, pageSize);
            
            if (lstAlarm.Count > 0)
            {
                int n = 0;
                StringBuilder strDevs = new StringBuilder();
                DataSet dsDev = new DataSet();
                foreach (PictureAlarmInfo pa in lstAlarm)
                {
                    strDevs.Append(String.Format(",'{0}'", pa.DevCode));
                }

                if (!strDevs.Equals(string.Empty))
                {
                    dbResult = dm.GetDeviceBaseInfoList(strDevs.ToString().Substring(1));
                    dsDev = dbResult.dsResult;
                }
                strAlarm.Append("{result:1");
                //strAlarm.Append(String.Format(",unitList:'{0}',devList:'{1}'", strControlUnitIdList, strDevCodeList.Replace("'","")));
                strAlarm.Append(String.Format(",dataCount:{0}", dataCount));

                if (strDevCode.Equals(string.Empty))
                {
                    strAlarm.Append(",list:[");
                    if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
                    {
                        foreach (PictureAlarmInfo pai in lstAlarm)
                        {
                            strAlarm.Append(this.FillPictureAlarmResult(pai, n, true, showAlarmArea, dsDev));
                            n++;
                        }
                    }
                    else
                    {
                        foreach (PictureAlarmInfo pai in lstAlarm)
                        {
                            strAlarm.Append(this.FillPictureAlarmResult(pai, n, true, showAlarmArea, null));
                            n++;
                        }
                    }
                    strAlarm.Append("]");
                }
                else
                {
                    if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
                    {
                        DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", strDevCode), "", DataViewRowState.CurrentRows);
                        if (dv.Count > 0)
                        {
                            DataRowView drv = dv[0];
                            DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                            strAlarm.Append(String.Format(",devCode:'{0}',devName:'{1}'", di.DevCode, di.DevName));
                        }
                        else
                        {
                            strAlarm.Append(",devCode:'',devName:''");
                        }
                    }
                    else
                    {
                        strAlarm.Append(",devCode:'',devName:''");
                    }
                    strAlarm.Append(",list:[");
                    foreach (PictureAlarmInfo pai in lstAlarm)
                    {
                        strAlarm.Append(this.FillPictureAlarmResult(pai, n, false, showAlarmArea, null));
                        n++;
                    }
                    strAlarm.Append("]");
                }
                strAlarm.Append("}");
            }
            else
            {
                strAlarm.Append(String.Format("{{result:1,dataCount:{0},list:[]}}", dataCount));
            }

            return strAlarm.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  填充报警结果
    protected string FillPictureAlarmResult(PictureAlarmInfo pai, int n, bool showDevInfo, bool showAlarmArea, DataSet dsDev)
    {
        try
        {
            StringBuilder strAlarm = new StringBuilder();
            if (pai != null)
            {
                strAlarm.Append(n > 0 ? "," : "");
                strAlarm.Append("{");
                strAlarm.Append(String.Format("devCode:'{0}',channelNo:'{1}',presetNo:'{2}'", pai.DevCode, pai.ChannelNo, pai.PresetNo));
                if (showAlarmArea)
                {
                    strAlarm.Append(String.Format(",alarmInfo:'{0}',alarmArea:'{1}'", pai.AlarmInfo, pai.AlarmArea));
                }
                strAlarm.Append(String.Format(",alarmType:'{0}',alarmLevel:'{1}',alarmTime:'{2}',alarmId:'{3}',alarmMonth:'{4}'", pai.AlarmType, pai.AlarmLevel, pai.AlarmTime, pai.Id, pai.AlarmMonth));
                strAlarm.Append(String.Format(",alarmPicture:'{0}',referencePicture:'{1}',referenceDomain:'{2}'", pai.PicturePath.Replace("\\", "\\\\"), pai.ReferencePath.Replace("\\", "\\\\"), pai.ReferenceDomain));
                if (showDevInfo)
                {
                    if (dsDev != null)
                    {
                        DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", pai.DevCode), "", DataViewRowState.CurrentRows);
                        if (dv.Count > 0)
                        {
                            DataRowView drv = dv[0];
                            DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                            strAlarm.Append(String.Format(",devName:'{0}'", di.DevName));
                        }
                        else
                        {
                            strAlarm.Append(",devName:''");
                        }
                    }
                    else
                    {
                        strAlarm.Append(",devName:''");
                    }
                }
                strAlarm.Append("}");
            }
            return strAlarm.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  删除报警记录
    protected string DeletePictureAlarmLog(string strIdList)
    {
        try
        {
            int n = 0;
            string[] arrList = strIdList.Split(',');
            foreach (string str in arrList)
            {
                string[] arrId = str.Split('_');
                string strTableName = "picture_alarm_" + arrId[0];
                n += pam.DeletePictureAlarm(strTableName, Convert.ToInt32(arrId[1]));
            }
            return String.Format("{{result:1,count:{0}}}", n);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,dataCount:0,list:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  填充报警结果
    protected string FillPictureAlarmResult(DataSet ds, bool showDevInfo, bool showAlarmArea, DataSet dsDev)
    {
        try
        {
            StringBuilder strAlarm = new StringBuilder();
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int n = 0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PictureAlarmInfo pai = pam.FillPictureAlarm(dr);

                    strAlarm.Append(n++ > 0 ? "," : "");
                    strAlarm.Append("{");
                    strAlarm.Append(String.Format("devCode:'{0}',channelNo:'{1}',presetNo:'{2}'", pai.DevCode, pai.ChannelNo, pai.PresetNo));
                    if (showAlarmArea)
                    {
                        strAlarm.Append(String.Format(",alarmInfo:'{0}',alarmArea:'{1}'", pai.AlarmInfo, pai.AlarmArea));
                    }
                    strAlarm.Append(String.Format(",alarmType:'{0}',alarmLevel:'{1}',alarmTime:'{2}',alarmId:'{3}'", pai.AlarmType, pai.AlarmLevel, pai.AlarmTime, pai.Id));
                    strAlarm.Append(String.Format(",alarmPicture:'{0}',referencePicture:'{1}',referenceDomain:'{2}'", pai.PicturePath.Replace("\\", "\\\\"), pai.ReferencePath.Replace("\\", "\\\\"), pai.ReferenceDomain));
                    if (showDevInfo)
                    {
                        if (dsDev != null)
                        {
                            DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", pai.DevCode), "", DataViewRowState.CurrentRows);
                            if (dv.Count > 0)
                            {
                                DataRowView drv = dv[0];
                                DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                                strAlarm.Append(String.Format(",devCode:'{0}',devName:'{1}'", di.DevCode, di.DevName));
                            }
                            else
                            {
                                strAlarm.Append(",devCode:'',devName:''");
                            }
                        }
                        else
                        {
                            strAlarm.Append(",devCode:'',devName:''");
                        }
                    }
                    strAlarm.Append("}");
                }
            }
            return strAlarm.ToString();
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion


    #region 获取图片报警  备份代码

    //
    /*
    string strTableName = "picture_alarm_" + dtStart.ToString("yyyyMM");
    dbResult = pam.GetPictureAlarmInfo(strTableName, strDevCodeList, channelNo, presetNo, alarmType, alarmLevel, strStartTime, strEndTime, pageIndex, pageSize);

    //Response.Write(dbResult.strSql.ToString()); 
    DataSet ds = dbResult.dsResult;
    DataSet dsDev = new DataSet();

    int dataCount = 0;
    if (ds != null && ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
    {
        dataCount = Convert.ToInt32(ds.Tables[1].Rows[0][0].ToString());
    }


    if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
    {
        StringBuilder strDevs = new StringBuilder();
        foreach (DataRow dr in ds.Tables[0].Rows)
        {
            DeviceBaseInfo dbi = dm.FillDeviceCode(dr);
            strDevs.Append(String.Format(",'{0}'", dbi.DevCode));
        }

        if (!strDevs.Equals(string.Empty))
        {
            dsDev = dm.GetDeviceBaseInfoList(strDevs.ToString().Substring(1));
        }

        strAlarm.Append("{result:1");
        //strAlarm.Append(String.Format(",unitList:'{0}',devList:'{1}'", strControlUnitIdList, strDevCodeList.Replace("'","")));
        strAlarm.Append(String.Format(",dataCount:{0}", dataCount));

        if (strDevCode.Equals(string.Empty))
        {
            strAlarm.Append(",list:[");
            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                strAlarm.Append(this.FillPictureAlarmResult(ds, true, showAlarmArea, dsDev));
            }
            else
            {
                strAlarm.Append(this.FillPictureAlarmResult(ds, true, showAlarmArea, null));
            }
            strAlarm.Append("]");
        }
        else
        {
            if (dsDev != null && dsDev.Tables[0] != null && dsDev.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(dsDev.Tables[0], String.Format("index_code='{0}'", strDevCode), "", DataViewRowState.CurrentRows);
                if (dv.Count > 0)
                {
                    DataRowView drv = dv[0];
                    DeviceInfo di = dm.FillDeviceBaseInfo(drv);
                    strAlarm.Append(String.Format(",devCode:'{0}',devName:'{1}'", di.DevCode, di.DevName));
                }
                else
                {
                    strAlarm.Append(",devCode:'',devName:''");
                }
            }
            else
            {
                strAlarm.Append(",devCode:'',devName:''");
            }
            strAlarm.Append(",list:[");
            strAlarm.Append(this.FillPictureAlarmResult(ds, false, showAlarmArea, null));
            strAlarm.Append("]");
        }
        strAlarm.Append("}");
    }
    else
    {
        strAlarm.Append("{result:0,dataCount:0,list:[]}");
    }
    */
    #endregion

}
