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
using System.IO;
using Zyrh.Common;
using System.Text;
using Zyrh.BLL;
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;

public partial class modules_safety_showInfo : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strType = string.Empty;
    protected string strCode = string.Empty;
    protected string strName = string.Empty;
    protected string strIntroduce = string.Empty;
    protected bool hasInfo = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        try
        {
            this.strType = Public.RequestString("type");
            this.strCode = Public.RequestString("code");
            this.strName = Public.RequestString("name");

            string strFilePath = string.Empty;
            
            switch (this.strType)
            {
                case "3":
                case "4":
                    this.strIntroduce = this.GetDepartment(this.strCode);
                    break;
                case "5":
                    this.strIntroduce = this.GetSubstation(this.strCode);
                    break;
            }

            this.hasInfo = !this.strIntroduce.Equals(string.Empty);
        }
        catch (Exception ex) { }
    }


    #region  获得部门简介
    public string GetDepartment(string strIndexCode)
    {
        try
        {
            DepartmentManage dm = new DepartmentManage(this.DBConnectionString);
            DBResultInfo dbResult = dm.GetSingleDepartmentInfo(strIndexCode);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                DepartmentInfo di = dm.FillDepartmentInfo(dr);
                return di.Introduce;
            }
            else
            {
                return string.Empty;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得所亭简介
    public string GetSubstation(string strIndexCode)
    {
        try
        {
            RailwaySubstationManage sm = new RailwaySubstationManage(this.DBConnectionString);
            DBResultInfo dbResult = sm.GetSingleSubstationInfo(strIndexCode);

            DataSet ds = dbResult.dsResult;
            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                RailwaySubstationInfo si = sm.FillSubstationInfo(dr);
                return si.Introduce;
            }
            else
            {
                return string.Empty;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
