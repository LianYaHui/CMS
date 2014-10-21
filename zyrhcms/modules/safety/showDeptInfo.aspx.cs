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

public partial class modules_safety_showDeptInfo : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strType = string.Empty;
    protected string strCode = string.Empty;
    protected string strName = string.Empty;
    protected string strIntroduce = string.Empty;
    protected bool hasInfo = false;
    protected string strImgPathDir = Public.WebDir + "/skin/default/images/railway/";
    protected string strImgPath = string.Empty;
    protected string strInfoType = string.Empty;

    protected StringBuilder strInfo = new StringBuilder();

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
                case "0":
                case "3":
                case "4":
                    this.GetDepartment(this.strCode);
                    this.strImgPath = Public.WebDir + "/upfiles/planeGraph/department/" + this.strCode + ".jpg";
                    //this.strImgPath = Public.WebDir + "/upfiles/planeGraph/department/01.jpg";
                    this.strInfoType = "department";
                    break;
                case "5":
                case "6":
                case "7":
                case "8":
                    this.GetSubstation(this.strCode);
                    this.strImgPath = Public.WebDir + "/upfiles/planeGraph/substation/" + this.strCode + ".jpg";
                    this.strInfoType = "substation";
                    break;
            }

            if (!File.Exists(Server.MapPath(this.strImgPath)))
            {
                this.strImgPath = string.Empty;
            }
        }
        catch (Exception ex) { }
    }


    #region  获得部门简介
    public void GetDepartment(string strIndexCode)
    {
        try
        {
            DepartmentManage dm = new DepartmentManage(this.DBConnectionString);
            DBResultInfo dbResult = dm.GetSingleDepartmentInfo(strIndexCode);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DepartmentInfo di = dm.FillDepartmentInfo(ds.Tables[0].Rows[0]);

                this.strName = di.Name;
                this.strIntroduce = Server.HtmlDecode(di.Introduce.Replace("\r\n", "<br />"));
            }
            this.hasInfo = !this.strIntroduce.Equals(string.Empty);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

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
                this.strIntroduce = Server.HtmlDecode(si.Introduce.Replace("\r\n", "<br />"));
            }
            this.hasInfo = !this.strIntroduce.Equals(string.Empty);
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
