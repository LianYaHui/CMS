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
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_capture : System.Web.UI.Page
{

    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string PicDBConnectionString = Public.PicDBConnectionString;

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected bool isDebug = false;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int channelNo = -1;
    protected int presetNo = -1;
    protected int fileId = 0;
    protected int referId = 0;
    protected int controlUnitId = 0;
    protected string strDevTypeCode = string.Empty;
    protected string strStartTime = string.Empty;
    protected string strEndTime = string.Empty;
    protected int days = 0;
    protected string strFilter = string.Empty;
    protected string strKeywords = string.Empty;
    protected string strDevCode = string.Empty;
    protected string strDevCodeList = string.Empty;

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
        this.controlUnitId = Public.RequestString("controlUnitId", 0);

        ui = uc.GetLoginUserInfo();
        if (this.controlUnitId == 0)
        {
            this.controlUnitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getCapture":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", -1);
                this.presetNo = Public.RequestString("presetNo", -1);
                this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));

                Response.Write(this.GetCapturePicture(this.strDevCode, this.channelNo, this.presetNo, this.strStartTime, this.strEndTime));
                break;
            case "getCaptureGuide":
                this.strDevCodeList = Public.RequestString("devCode");
                this.strStartTime = Public.RequestString("startTime", DateTime.Now.ToString("yyyy-MM-dd 0:00:00"));
                this.strEndTime = Public.RequestString("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
                int showType = Public.RequestString("showType", -1);
                Response.Write(this.GetCaptureGuide(this.strDevCodeList, this.strStartTime, this.strEndTime, showType));
                break;
            case "getReference":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", -1);
                this.presetNo = Public.RequestString("presetNo", -1);
                Response.Write(this.GetReferencePicture(this.strDevCode, this.channelNo, this.presetNo));
                break;
            case "deleteReference":
                this.referId = Public.RequestString("id", 0);
                Response.Write(this.DeleteReferencePicture(this.strDevCode, this.channelNo, this.presetNo, this.referId));
                break;
            case "addReference":
                this.strDevCode = Public.RequestString("devCode", string.Empty);
                this.channelNo = Public.RequestString("channelNo", -1);
                this.presetNo = Public.RequestString("presetNo", -1);
                this.fileId = Public.RequestString("fileId", 0);
                string strFilePath = Public.RequestString("filePath", string.Empty);
                string uploadMonth = Public.RequestString("uploadMonth", string.Empty);
                Response.Write(this.AddReferencePicture(this.strDevCode, this.channelNo, this.presetNo, this.fileId, uploadMonth, strFilePath));
                break;
            default:
                Response.Write(String.Format("ok,{0}", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")));
                break;
        }

    }

    #region  获得抓拍图
    protected string GetCapturePicture(string strDevCode, int channelNo, int presetNo, string strStartTime, string strEndTime)
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            DateTime dtStart = DateTime.Parse(strStartTime);
            DateTime dtEnd = DateTime.Parse(strEndTime);
            TimeSpan ts = dtEnd-dtStart;
            int days = Convert.ToInt32(ts.TotalDays);
            string strMonthStart = dtStart.ToString("yyyyMM");
            string strMonthEnd = dtEnd.ToString("yyyyMM");

            StringBuilder strRefer = new StringBuilder();
            StringBuilder strPic = new StringBuilder();

            DeviceUploadFileManage ufm = new DeviceUploadFileManage(this.PicDBConnectionString);
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);

            strResult.Append(String.Format("{{result:1,days:{0}", days));
            strResult.Append(",refer:[");

            DBResultInfo dbRefer = rpm.GetReferencePictureInfo(strDevCode, channelNo, presetNo, -1);
            DataSet dsRefer = dbRefer.dsResult;
            if (dsRefer != null && dsRefer.Tables[0] != null && dsRefer.Tables[0].Rows.Count > 0)
            {
                int m = 0;
                string strText = "";
                foreach (DataRow dr in dsRefer.Tables[0].Rows)
                {
                    ReferencePictureInfo rpi = rpm.FillReferencePicture(dr);
                    strRefer.Append(m > 0 ? "," : "");
                    strRefer.Append("{");
                    strText = "rid:{0},path:'{1}',dcode:'{2}',cn:{3},pn:{4},time:'{5}',domain:'{6}'";
                    strRefer.Append(String.Format(strText, rpi.Id, rpi.PicturePath.Replace("\\", "/"), rpi.DevCode, rpi.ChannelNo, rpi.PresetNo, rpi.CreateTime, rpi.PictureDomain));
                    strRefer.Append("}");
                    m++;
                }
            }
            strResult.Append(strRefer.ToString());
            strResult.Append("]");

            //int dataCount = ufm.GetUploadFileTotal(strDevCode, channelNo, presetNo, -1, strStartTime, strEndTime);

            DBResultInfo dbResult = ufm.GetUploadFileInfoAllData(strDevCode, channelNo, presetNo, -1, strStartTime, strEndTime, 0, -1, -1, 0, 0);
            DataSet dsPic = dbResult.dsResult;

            //strResult.Append(String.Format(",sql:'{0}'", dbResult.strSql.Replace("'", "’")));

            strResult.Append(",pics:[");
            if (dsPic != null && dsPic.Tables[0] != null && dsPic.Tables[0].Rows.Count > 0)
            {
                string strText = "";
                for (int i = 0; i < days; i++)
                {
                    string strDateTime = dtEnd.AddDays(-i).ToString("yyyy-MM-dd"); 
                    int n = 0;

                    DataView dv = new DataView(dsPic.Tables[0], "upload_time >= '" + strDateTime + " 0:00:00" + "' and upload_time <= '" + strDateTime + " 23:59:59" + "' ", "", DataViewRowState.CurrentRows);

                    strPic.Append(i > 0 ? ",{" : "{");
                    strPic.Append(String.Format("date:'{0}'", strDateTime));
                    strPic.Append(String.Format(",month:'{0}'", strDateTime.Replace("-", "").Substring(0, 6)));
                    strPic.Append(String.Format(",dataCount:{0}", dv.Count));
                    strPic.Append(String.Format(",devCode:'{0}'", strDevCode));
                    strPic.Append(String.Format(",channelNo:{0}", channelNo));
                    strPic.Append(String.Format(",presetNo:{0}", presetNo));
                    strPic.Append(",list:[");
                    foreach (DataRowView drv in dv)
                    {
                        DeviceUploadFileInfo ufi = ufm.FillUploadFile(drv);
                        ufi.UploadMonth = drv["upload_month"].ToString();

                        strPic.Append(n > 0 ? "," : "");
                        strPic.Append("{");
                        ////strText = "fileId:{0},filePath:'{1}',devCode:'{2}',channelNo:{3},presetNo:{4},uploadTime:'{5}',uploadMonth:'{6}'";
                        strText = "fid:{0},path:'{1}',dcode:'{2}',cn:{3},pn:{4},time:'{5}',month:'{6}'";
                        strPic.Append(String.Format(strText, ufi.FileId, ufi.FilePath.Replace("\\", "/"), ufi.DevCode, ufi.ChannelNo, ufi.PresetNo, ufi.UploadTime, ufi.UploadMonth));
                        //strText = "fid:{0},path:'{1}'";
                        //strPic.Append(String.Format(strText, ufi.FileId, ufi.FilePath));
                        
                        strPic.Append("}");
                        n++;
                    }
                    strPic.Append("]");
                    strPic.Append("}");
                }
            }
            else
            {
                for (int i = 0; i < days; i++)
                {
                    string strDateTime = dtEnd.AddDays(-i).ToString("yyyy-MM-dd");
                    strPic.Append(i > 0 ? ",{" : "{");
                    strPic.Append(String.Format("date:'{0}'", strDateTime));
                    strPic.Append(",list:[]");
                    strPic.Append("}");
                }
            }
            strResult.Append(strPic.ToString().Replace("\\", "/"));
            strResult.Append("]}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,refer:[],pics:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  获得抓拍图历史记录向导（统计哪些日期有抓拍图）
    protected string GetCaptureGuide(string strDevCodeList, string strStartTime, string strEndTime, int showType)
    {
        try
        {
            DeviceUploadFileManage ufm = new DeviceUploadFileManage(this.PicDBConnectionString);

            StringBuilder strResult = new StringBuilder();
            DateTime dtStart = DateTime.Parse(strStartTime);
            DateTime dtEnd = DateTime.Parse(strEndTime);
            TimeSpan ts = dtEnd - dtStart;
            int days = ts.Days;
            bool isDesc = days < 0;

            strResult.Append("{result:1");
            strResult.Append(String.Format(",days:{0}", Math.Abs(days)));
            strResult.Append(",list:[");
            int num = 0;
            for (int i = 0, c = Math.Abs(days); i <= c; i++)
            {
                DateTime dt = dtStart.AddDays(isDebug ? -i : i);
                string strTableName = ufm.BuildUploadFileTableName(dt.ToString("yyyyMM"));

                int count = ufm.GetUploadFileCount(strTableName, strDevCodeList, -1, -1, -1,
                    dt.ToString("yyyy-MM-dd 0:00:00"), dt.ToString("yyyy-MM-dd 23:59:59"), 0, -1, -1);
                if (1 == showType)
                {
                    if (count > 0)
                    {
                        strResult.Append(num++ > 0 ? "," : "");
                        strResult.Append(String.Format("['{0}',{1}]", dt.ToString("yyyy-MM-dd"), count));
                    }
                }
                else
                {
                    strResult.Append(num++ > 0 ? "," : "");
                    strResult.Append(String.Format("['{0}',{1}]", dt.ToString("yyyy-MM-dd"), count));
                }
            }
            strResult.Append("]");
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得参考图
    protected string GetReferencePicture(string strDevCode, int channelNo, int presetNo)
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            StringBuilder strRefer = new StringBuilder();
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);

            strResult.Append("{result:1,refer:[");

            DBResultInfo dbRefer = rpm.GetReferencePictureInfo(strDevCode, channelNo, presetNo, -1);
            DataSet dsRefer = dbRefer.dsResult;
            if (dsRefer != null && dsRefer.Tables[0] != null && dsRefer.Tables[0].Rows.Count > 0)
            {
                int m = 0;
                string strText = "";
                foreach (DataRow dr in dsRefer.Tables[0].Rows)
                {
                    ReferencePictureInfo rpi = rpm.FillReferencePicture(dr);
                    strRefer.Append(m > 0 ? "," : "");
                    strRefer.Append("{");
                    strText = "referId:'{0}',filePath:'{1}',devCode:'{2}',channelNo:'{3}',presetNo:'{4}',createTime:'{5}'";
                    strRefer.Append(String.Format(strText, rpi.Id, rpi.PicturePath.Replace("\\", "/"), rpi.DevCode, rpi.ChannelNo, rpi.PresetNo, rpi.CreateTime));
                    strRefer.Append("}");
                    m++;
                }
            }
            strResult.Append(strRefer.ToString());
            strResult.Append("]}");
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,refer:[],error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  删除参考图
    protected string DeleteReferencePicture(string strDevCode, int channelNo, int presetNo, int id)
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);
            int count = rpm.DeleteReferencePicture(id.ToString());
            if (count > 0)
            {
                strResult.Append(String.Format("{{result:1,count:{0}}}", count));
            }
            else
            {
                strResult.Append(String.Format("{{result:0,count:{0}}}", count));
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,count:0,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加参考图
    public string AddReferencePicture(string strDevCode, int channelNo, int presetNo, int fileId, string uploadMonth, string strFilePath)
    {
        StringBuilder strResult = new StringBuilder();
        try
        {
            strFilePath = strFilePath.Replace("\\", "\\\\").Replace("/", "\\\\");
            ReferencePictureManage rpm = new ReferencePictureManage(this.DBConnectionString);

            DBResultInfo dbExist = rpm.CheckReferencePictureIsExist(strDevCode, channelNo, presetNo, strFilePath, -1, fileId);
            if (dbExist.iResult == 0)
            {
                ReferencePictureInfo rpi = new ReferencePictureInfo();
                rpi.DevCode = strDevCode;
                rpi.ChannelNo = channelNo;
                rpi.PresetNo = presetNo;
                rpi.PicturePath = strFilePath;
                rpi.PictureSource = UploadFileSource.Device.GetHashCode();
                rpi.PictureDomain = PictureDomain.Device.GetHashCode();
                rpi.AddType = ReferencePictureAddType.UserManual.GetHashCode();

                UserInfo ui = uc.GetLoginUserInfo();
                rpi.OperatorId = ui.UserId;
                rpi.OperatorIp = new DomainIp().GetIpAddress();

                DeviceCameraPreset dcp = new PresetConfigManage(this.DBConnectionString).GetDeviceCamearPresetId(strDevCode, channelNo, presetNo);
                rpi.DevId = dcp.DevId;
                rpi.CameraId = dcp.CameraId;
                rpi.PresetId = dcp.PresetId;
                rpi.UnitId = dcp.UnitId;
                rpi.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                DBResultInfo dbResult = rpm.AddReferencePicture(rpi);

                if (dbResult.iResult > 0)
                {
                    strResult.Append(String.Format("{{result:1,count:{0}}}", dbResult.iResult));
                }
                else
                {
                    strResult.Append(String.Format("{{result:0,count:{0}}}", dbResult.iResult));
                }
            }
            else
            {
                strResult.Append("{result:2,count:0}");
            }
            return strResult.ToString();
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,count:0,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

}
