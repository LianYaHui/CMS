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
using Zyrh.BLL;
using Zyrh.BLL.Info;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Info;

public partial class modules_infoManage_sub_bulletinDetail : System.Web.UI.Page
{
    protected int id = 0;
    protected BulletinInfo info = new BulletinInfo();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        this.id = Public.RequestString("id", 0);
        if (this.id > 0)
        {
            this.GetBulletin(this.id);
        }
        else
        {
            Response.Write("参数错误");
        }
    }

    protected void GetBulletin(int id)
    {
        try
        {
            BulletinManage bm = new BulletinManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = bm.GetBulletin(id);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                this.info = bm.FillBulletin(ds.Tables[0].Rows[0]);
            }
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
        }
    }

}