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
using System.IO;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;

public partial class modules_safety_control_ZJST : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strAction = string.Empty;
    protected int eid = -1;
    protected int step = -1;
    protected int sub = -1;

    protected string strType = string.Empty;
    protected string strCode = string.Empty;
    protected string strName = string.Empty;
    protected string strIntroduce = string.Empty;
    protected bool hasInfo = false;
    protected string strImgPathDir = Public.WebDir + "/skin/default/images/railway/";
    protected string strImgPath = string.Empty;
    protected string strInfoType = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.Initial();
            this.GetSubstation(string.Empty, string.Empty);
        }
    }

    public void Initial()
    {
        this.strAction = Public.RequestString("action");
        this.eid = Public.RequestString("eid", -1);
        this.step = Public.RequestString("step", -1);
        this.sub = Public.RequestString("sub", -1);

        this.strImgPath = Public.WebDir;
    }


    #region  获得所亭简介
    public void GetSubstation(string strIndexCode)
    {
        try
        {
            RailwaySubstationManage sm = new RailwaySubstationManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetSingleSubstationInfo(strIndexCode);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                RailwaySubstationInfo si = sm.FillSubstationInfo(ds.Tables[0].Rows[0]);

                this.strName = si.Name;
                this.strIntroduce = si.Introduce;
            }
            this.hasInfo = !this.strIntroduce.Equals(string.Empty);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得所亭信息
    public void GetSubstation(string strLineIndexCodeList, string strTypeIdList)
    {
        try
        {
            RailwaySubstationManage sm = new RailwaySubstationManage(this.DBConnectionString);

            DBResultInfo dbResult = sm.GetSubstationInfo(strLineIndexCodeList, strTypeIdList);

            DataSet ds = dbResult.dsResult;

            this.ddlSubstation.Items.Clear();

            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwaySubstationInfo info = sm.FillSubstationInfo(dr);

                    li = new ListItem(info.PinYinCode + "  " + info.Name, info.IndexCode);
                    this.ddlSubstation.Items.Add(li);
                }
            }
            else
            {
                this.ddlSubstation.Items.Clear();
            }
            li = new ListItem("请选择", "");
            this.ddlSubstation.Items.Insert(0, li);
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

}
