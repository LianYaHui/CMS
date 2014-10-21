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
using Zyrh.Common;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class ajax_export : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;

    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strAction = string.Empty;
    protected string strFileName = string.Empty;
    protected string strContent = string.Empty;
    protected int unitId = 0;
    protected bool isIE = true;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        if (!IsPostBack)
        {
            this.strAction = Public.GetRequest("action", string.Empty);
            this.unitId = Public.GetRequest("unitId", 0);

            ui = uc.GetLoginUserInfo();

            if (this.unitId == 0)
            {
                this.unitId = ui.UnitId;
            }

            switch (this.strAction)
            {
                case "exportDevice":
                    this.isIE = Public.RequestString("isIE", 1) == 1;
                    this.ExportDeviceInfo(this.unitId, ui.UserName, this.isIE);
                    break;
                case "exportExcel":
                    this.strFileName = Public.RequestString("fileName");
                    this.strContent = Public.RequestString("content");
                    string strSheetName = Public.RequestString("sheetName");
                    this.ExportExcel(this.strFileName, strSheetName, this.strContent, this.isIE);
                    break;
                case "exportWord":
                    this.strFileName = Public.RequestString("fileName");
                    this.strContent = Public.RequestString("content");
                    this.ExportWord(this.strFileName, this.strContent, this.isIE);
                    break;
            }
        }

    }

    #region  导出设备信息
    protected void ExportDeviceInfo(int unitId, string strUserName, bool isIE)
    {
        try
        {

            StringBuilder strDev = new StringBuilder();
            ControlUnitManage cum = new ControlUnitManage(this.DBConnectionString);
            UserManage um = new UserManage(this.DBConnectionString);
            UserInfo ui = um.GetUserInfo(strUserName);

            DataSet dsUnit = cum.GetControlUnit(unitId);
            string strUnitName = string.Empty;
            if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
            {
                DataRow drUnit = dsUnit.Tables[0].Rows[0];
                ControlUnitInfo cui = cum.FillControlUnit(drUnit);
                strUnitName = cui.UnitName;
            }

            DeviceManage dm = new DeviceManage(this.DBConnectionString);
            DeviceConfigManage dcm = new DeviceConfigManage(this.DBConnectionString);

            string strControlUnitIdList = cum.GetControlUnitIdList(unitId);

            DBResultInfo dbResult = dm.GetDeviceGprsInfo(strControlUnitIdList, string.Empty, string.Empty, -1, -1, string.Empty, string.Empty, 0, 0);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strDev.Append("<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\" style=\"text-align:left;\">");

                string[] arrCellValue = { "序号", "组织单元", "设备名称", "设备编号", "电池电量", "3G状态", "2G状态", "纬度", "经度" };
                int c = arrCellValue.Length;

                strDev.Append(this.BuildRowCell(arrCellValue));
                int i=0;
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    DeviceInfo di = dm.FillDeviceInfo(dr);
                    DeviceConfigInfo dci = dcm.FillDeviceConfigInfoForGprs(dr);

                    arrCellValue = new string[c];
                    arrCellValue[0] = (i + 1).ToString();
                    arrCellValue[1] = di.UnitName;
                    arrCellValue[2] = di.DevName;
                    arrCellValue[3] = di.DevCode;
                    arrCellValue[4] = di.devStatus.VoltagePower.ToString();
                    arrCellValue[5] = di.devStatus.Status3G == 1 ? "在线" : "离线";
                    arrCellValue[6] = di.devStatus.Status2G == 1 ? "在线" : "离线";
                    arrCellValue[7] = di.devStatus.Latitude;
                    arrCellValue[8] = di.devStatus.Longitude;

                    strDev.Append(this.BuildRowCell(arrCellValue));

                    i++;
                }
                strDev.Append("</table>");
            }
            string strFileName = strUnitName + "_" + DateTime.Now.ToString("yyyyMMddHHmm");
            FileOperate.ExportExcel(strFileName, strDev.ToString(), Encoding.UTF8);

        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion
    
    #region  创建表头
    /// <summary>
    /// 创建表头
    /// </summary>
    /// <returns></returns>
    public string BuildHeader()
    {
        StringBuilder strHeader = new StringBuilder();
        strHeader.Append("<tr style=\"background:#ddd; height:20px;\">");
        strHeader.Append("<td>序号</td>");
        strHeader.Append("<td>组织单位</td>");
        strHeader.Append("<td>设备名称</td>");
        strHeader.Append("<td>设备编号</td>");
        strHeader.Append("<td>经度</td>");
        strHeader.Append("<td>纬度</td>");
        strHeader.Append("<td>电量</td>");
        strHeader.Append("<td>3G</td>");
        strHeader.Append("<td>2G</td>");
        strHeader.Append("</tr>");
        return strHeader.ToString();
    }
    #endregion

    #region  创建表格内容
    /// <summary>
    /// 创建表格内容
    /// </summary>
    /// <param name="egm"></param>
    /// <returns></returns>
    public string BuildRowCell(string[] arrCellValue)
    {
        StringBuilder strRowCell = new StringBuilder();

        strRowCell.Append("<tr>");
        foreach (string str in arrCellValue)
        {
            strRowCell.Append(String.Format("<td>{0}</td>", str));
        }
        strRowCell.Append("</tr>");

        return strRowCell.ToString();
    }
    #endregion

    #region  导出Word文档
    protected void ExportWord(string strFileName, string strContent, bool isIE)
    {
        try
        {
            FileOperate.ExportWord(strFileName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

    #region  导出Excel文档
    protected void ExportExcel(string strFileName, string strSheetName, string strContent, bool isIE)
    {
        try
        {
            FileOperate.ExportExcel(strFileName, strSheetName, strContent, Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
