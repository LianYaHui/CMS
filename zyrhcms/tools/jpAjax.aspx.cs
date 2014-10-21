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

public partial class tools_jpAjax : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected string strTensionLengthIndexCode = string.Empty;
    protected string strContent = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        this.strAction = Public.RequestString("action");
        switch (this.strAction)
        {
            case "saveExcel":
                this.strTensionLengthIndexCode = Public.RequestString("tensionLengthIndexCode");
                this.strContent = Public.RequestString("content");

                Response.Write(this.SaveExcel(this.strTensionLengthIndexCode, this.strContent));
                break;
            case "exportExcel":
                this.strTensionLengthIndexCode = Public.RequestString("tensionLengthIndexCode");
                this.ExportExcel(this.strTensionLengthIndexCode, true);
                break;
        }
    }

    protected string SaveExcel(string strTensionLengthIndexCode, string strContent)
    {
        try
        {

            FileOperate.WriteFile(Server.MapPath("pillar_xls/" + strTensionLengthIndexCode + ".txt"), "acc", false, Encoding.GetEncoding("utf-8"));

            return String.Format("{{result:1}}");
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }

    #region  导出Excel文档
    protected void ExportExcel(string strTensionLengthIndexCode, bool isIE)
    {
        try
        {
            string strFileName = "锚段(" + strTensionLengthIndexCode + ")支柱坐标信息";
            string strSheetName = "锚段_" + strTensionLengthIndexCode;
            string strContent = FileOperate.ReadFile(Server.MapPath("pillar_xls/" + strTensionLengthIndexCode + ".txt"), Encoding.GetEncoding("utf-8"));
            string[] arrContent = strContent.Split(',');

            StringBuilder strResult = new StringBuilder();

            strResult.Append("<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\">");
            strResult.Append("<tr>");
            strResult.Append("<td>支柱名称</td>");
            strResult.Append("<td>纬度</td>");
            strResult.Append("<td>经度</td>");
            strResult.Append("</tr>");
            foreach (string strItem in arrContent)
            {
                string[] arrTemp = strItem.Split('_');
                strResult.Append("<tr>");
                foreach (string str in arrTemp)
                {
                    strResult.Append("<td>");
                    strResult.Append(str);
                    strResult.Append("</td>");
                }
                strResult.Append("</tr>");
            }
            strResult.Append("</table>");

            FileOperate.ExportExcel(strFileName, strSheetName, strResult.ToString(), Encoding.UTF8, isIE);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
