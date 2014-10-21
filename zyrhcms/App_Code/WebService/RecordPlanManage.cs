using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using Zyrh.DBUtility;

/// <summary>
/// RecordPlanManage 的摘要说明
/// </summary>
public class RecordPlanManage
{
    public RecordPlanManage()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public string GetRecordPlan(string strDevCode, int serverId)
    {
        try
        {
            StringBuilder strXml = new StringBuilder();

            StringBuilder strSql = new StringBuilder();

            DataSet ds = new DataSet();
            string[] strDelimiter = { ",", "，", "|" };
            string[] arrDev = strDevCode.Split(strDelimiter, StringSplitOptions.RemoveEmptyEntries);

            string strDevCodeList = string.Empty;
            foreach (string str in arrDev)
            {
                if (!str.Equals(string.Empty))
                {
                    strDevCodeList += "," + str;
                }
            }

            strSql.Append("select p.* from record_plan p,device_info di where 1 = 1 ");
            if (!strDevCodeList.Equals(string.Empty))
            {
                strDevCodeList = strDevCodeList.Substring(1);

                if (strDevCodeList.IndexOf(",") > 0)
                {
                    strSql.Append(String.Format(" and p.device_indexcode in({0}) ", strDevCodeList.IndexOf("','") < 0 ? String.Format("'{0}'", strDevCodeList.Replace(",", "','")) : strDevCodeList));
                }
                else
                {
                    strSql.Append(String.Format(" and p.device_indexcode = '{0}' ", strDevCodeList.Replace("'", "")));
                }
            }

            if (serverId > 0)
            {
                strSql.Append(String.Format(" and di.pag_server_id = '{0}' ", serverId));
            }
            strSql.Append(";");
            ds = MySqlHelper.ExecuteDataSet(Public.CmsDBConnectionString, strSql.ToString());
            strXml.Append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                strXml.Append(String.Format("<record_count>{0}</record_count>", ds.Tables[0].Rows.Count));
                strXml.Append("<record_plan>");
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    strXml.Append("<plan_config>");
                    strXml.Append(String.Format("<dev>{0}</dev><channel>{1}</channel><stream_type>{2}</stream_type><connect_type>{3}</connect_type><use_frame_time>{4}</use_frame_time><plan>{5}</plan><days_plan>{6}</days_plan>",
                        dr["device_indexcode"], dr["channel_no"], dr["stream_type"], dr["connect_type"], dr["use_frame_time"], dr["plan"], dr["days_plan"]));
                    strXml.Append("</plan_config>");
                }
                strXml.Append("</record_plan>");
            }
            else
            {
                strXml.Append("<record_count>0</record_count>");
                strXml.Append("<record_plan>");
                strXml.Append("<plan_config>");
                strXml.Append("</plan_config>");
                strXml.Append("</record_plan>");
            }

            return strXml.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }

}
