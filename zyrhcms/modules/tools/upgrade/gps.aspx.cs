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
using Zyrh.DBUtility;
using Zyrh.DAL;

public partial class modules_tools_upgrade_gps : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnUpgrade_Click(object sender, EventArgs e)
    {
        string strMaxDate = "2014-03-21";
        string strMinDate = "2013-09-02";

        DateTime dtMin = DateTime.Parse(strMinDate);
        DateTime dtMax = DateTime.Parse(strMaxDate);

        DateTime dtNow = dtMax.AddDays(-1);
        while (dtNow.CompareTo(dtMin) == 1)
        {
            string strDate = dtNow.ToString("yyyyMMdd");
            string strTableName = "gps" + strDate;
            if (DBConnectionAccess.CheckTableIsExists(Public.GpsDBConnectionString, strTableName) > 0)
            {
                string strSql = String.Format(this.txtSql.Text.Trim(), strTableName);
                MySqlHelper.ExecuteNonQuery(Public.GpsDBConnectionString, strSql);
            }

            dtNow = dtNow.AddDays(-1);
        }
    }
}
