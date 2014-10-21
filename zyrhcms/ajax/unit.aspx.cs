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
using Zyrh.BLL;
using Zyrh.DAL;
using Zyrh.Model;

public partial class ajax_unit : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;

    protected ControlUnitManage cum = new ControlUnitManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strAction = string.Empty;
    protected int unitId = 0;

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

        this.unitId = Public.RequestString("unitId", 0);

        int parentId = Public.RequestString("parentId", 0);
        string strUnitName = Public.RequestString("unitName", string.Empty);
        string strUnitCode = Public.RequestString("unitCode", DateTime.Now.ToString("yyMMddHHmmssfff") + new Random().Next(0, 10));

        ui = uc.GetLoginUserInfo();
        if (this.unitId == 0)
        {
            this.unitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getUnitCode":
                Response.Write(DateTime.Now.ToString("yyMMddHHmmssfff") + new Random().Next(0, 10));
                break;
            case "getUnitInfo":
                Response.Write(this.GetUnitInfo(this.unitId));
                break;
            case "addControlUnit":
                Response.Write(this.AddControlUnit(parentId, strUnitName, strUnitCode, ui.UserId));
                break;
            case "editControlUnit":
                this.unitId = Public.RequestString("unitId", 0);
                Response.Write(this.UpdateControlUnitName(this.unitId, strUnitName, strUnitCode));
                break;
            case "deleteControlUnit":
                this.unitId = Public.RequestString("unitId", 0);
                Response.Write(this.DeleteControlUnit(this.unitId));
                break;
            default:
                Response.Write("ok");
                break;
        }

    }

    #region  获得组织单元信息
    public string GetUnitInfo(int unitId)
    {
        try
        {
            DataSet dsUnit = cum.GetControlUnit(unitId);
            if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
            {
                ControlUnitInfo cui = cum.FillControlUnit(dsUnit.Tables[0].Rows[0]);
                StringBuilder strResult = new StringBuilder();
                strResult.Append("{");
                strResult.Append("result:1,unit:{");
                strResult.Append(String.Format("id:{0},code:'{1}',name:'{2}'", cui.UnitId, cui.UnitCode, cui.UnitName));
                strResult.Append("}");
                strResult.Append("}");

                return strResult.ToString();
            }
            else
            {
                return "{result:0,unit:{}}";
            }
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,unit:{},error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加组织机构
    protected string AddControlUnit(int parentId, string strUnitName, string strUnitCode, int userId)
    {
        try
        {
            int isexist = cum.CheckControlUnitIsExist(strUnitName, strUnitCode, 0);
            if (isexist == 0)
            {
                ControlUnitInfo parent = new ControlUnitInfo();
                DataSet dsUnit = cum.GetControlUnit(parentId);
                if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
                {
                    DataRow dr = dsUnit.Tables[0].Rows[0];
                    parent = cum.FillControlUnit(dr);

                    ControlUnitInfo cui = new ControlUnitInfo();
                    cui.UnitName = strUnitName;
                    cui.UnitCode = strUnitCode;
                    cui.UnitLevel = parent.UnitLevel + 1;
                    cui.SequenceIndex = 0;
                    cui.ParentId = parentId;
                    cui.ParentTree = parent.ParentTree;
                    cui.OperatorId = userId;
                    cui.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cui.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                    DBResultInfo dbResult = cum.AddControlUnit(cui);
                    int unitId = dbResult.iResult;
                    if (unitId > 0)
                    {
                        string strParentTree = parent.ParentTree + String.Format("({0})", unitId);
                        cum.UpdateControlUnitParentTree(strParentTree, unitId);

                        return String.Format("{{result:1,unitId:'{0}'}}", unitId);
                    }
                    else
                    {
                        return String.Format("{{result:0}}");
                    }
                }
                return String.Format("{{result:0}}");
            }
            else
            {
                return String.Format("{{result:-2}}");
            }
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,unitId:'0',error:'{0}'}}", Public.ReplaceSingleQuotes(ex.Message));
        }
    }
    #endregion

    #region  添加组织机构名称
    protected string UpdateControlUnitName(int unitId, string strUnitName, string strUnitCode)
    {
        try
        {
            int isexist = cum.CheckControlUnitIsExistForUpdateName(strUnitName, strUnitCode, unitId);
            if (isexist == 0)
            {
                int result = cum.UpdateControlUnitName(strUnitName, strUnitCode, unitId);

                return String.Format("{{result:{0}}}", result > 0 ? 1 : 0);
            }
            else
            {
                return "{result:-2}"; //名称已被占用，不能重复
            }
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  检测组织机构是否是所辖机构
    public bool CheckUnitIsIn(int unitId, int userUnitId)
    {
        try
        {
            DataSet ds = cum.GetControlUnitChildList(userUnitId);
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataView dv = new DataView(ds.Tables[0], "control_unit_id=" + unitId, "", DataViewRowState.CurrentRows);

                return dv.Count > 0;
            }
            return false;
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  删除组织机构
    public string DeleteControlUnit(int unitId)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (!uc.CheckUserLogin())
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'您还没有登录，无权限删除组织机构！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            else if (!uc.IsAdmin)
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'当前帐户无权限删除组织机构！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            else if (!this.CheckUnitIsIn(unitId, ui.UnitId))
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'注意：您只能删除当前帐户所辖的组织机构！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            int childCount = cum.GetChildUnitCount(unitId);
            int deviceCount = cum.GetUnitDeviceCount(unitId);
            int userCount = cum.GetUnitUserCount(unitId);

            if (unitId <= 1)
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'根目录不能删除！'");
            }
            else if (childCount > 0 || deviceCount > 0 || userCount > 0)
            {
                strResult.Append("{result:0");
                strResult.Append(String.Format(",childCount:{0}", childCount));
                strResult.Append(String.Format(",userCount:{0}", userCount));
                strResult.Append(String.Format(",deviceCount:{0}", deviceCount));
                strResult.Append(",msg:'该组织机构下含有下级组织机构、用户信息以及设备信息，不能删除！'");
            }
            else
            {
                int result = cum.DeleteControlUnit(unitId);
                if (result > 0)
                {
                    strResult.Append("{result:1");
                }
                else
                {
                    strResult.Append("{result:0");
                    strResult.Append(",msg:'删除组织机构失败，请稍候再试！'");
                }
            }
            strResult.Append("}");

            return strResult.ToString();
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", ex.Message, Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

}
