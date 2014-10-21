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
using Zyrh.BLL.BaseInfo;
using Zyrh.Model;
using Zyrh.Model.BaseInfo;

public partial class modules_safety_eventEdit : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
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
            this.GetProfession();
            this.GetRailwayLine();
            this.GetUpDownLine();
            this.GetEventLevel();
            this.GetSubstation(string.Empty, string.Empty);
        }
        catch (Exception ex) { Response.Write(ex.Message); }
    }

    #region  获得专业信息
    protected void GetProfession()
    {
        try
        {
            ProfessionManage pm = new ProfessionManage(this.DBConnectionString);
            DBResultInfo dbResult = pm.GetProfessionInfo();

            DataSet ds = dbResult.dsResult;

            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    ProfessionInfo info = pm.FillProfessionInfo(dr);

                    li = new ListItem(info.Code + " " + info.Name, info.Id.ToString());
                    this.ddlProfession.Items.Add(li);
                }
            }
            else
            {
                this.ddlProfession.Items.Clear();
            }
            li = new ListItem("请选择", "0");
            this.ddlProfession.Items.Insert(0, li);
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得线别信息
    protected void GetRailwayLine()
    {
        try
        {
            RailwayLineManage lm = new RailwayLineManage(this.DBConnectionString);
            DBResultInfo dbResult = lm.GetLineInfo();

            DataSet ds = dbResult.dsResult;

            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayLineInfo info = lm.FillRailwayLine(dr);

                    li = new ListItem(info.LineName, info.Id.ToString() + "," + info.LineNumber);
                    this.ddlLine.Items.Add(li);
                }
            }
            else
            {
                this.ddlLine.Items.Clear();
            }
            li = new ListItem("请选择", "0,0");
            this.ddlLine.Items.Insert(0, li);
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion


    #region  获得行别信息
    protected void GetUpDownLine()
    {
        try
        {
            RailwayUpDownLineManage lm = new RailwayUpDownLineManage(this.DBConnectionString);
            DBResultInfo dbResult = lm.GetUpDownLineInfo();

            DataSet ds = dbResult.dsResult;

            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayUpDownLineInfo info = lm.FillUpDownLine(dr);

                    li = new ListItem(info.Name, info.Id.ToString());
                    this.ddlUpDown.Items.Add(li);
                }
            }
            else
            {
                this.ddlUpDown.Items.Clear();
            }
            li = new ListItem("请选择", "0");
            this.ddlUpDown.Items.Insert(0, li);
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  获得严重等级
    public void GetEventLevel()
    {
        try
        {
            RailwayEventLevelManage elm = new RailwayEventLevelManage(this.DBConnectionString);
            DBResultInfo dbResult = elm.GetEventLevelInfo(-1);

            DataSet ds = dbResult.dsResult;

            ListItem li;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    RailwayEventLevelInfo info = elm.FillEventLevelInfo(dr);

                    li = new ListItem(info.LevelName + " " + info.LevelDesc, info.LevelId.ToString());
                    this.ddlLevel.Items.Add(li);
                }
            }
            else
            {
                this.ddlLevel.Items.Clear();
            }
            li = new ListItem("请选择", "0");
            this.ddlLevel.Items.Insert(0, li);
        }
        catch (Exception ex) { throw (ex); }
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

                    li = new ListItem(info.PinYinCode + "  " + info.Name, info.IndexCode + "," + info.Name + "," + info.Latitude + "," + info.Longitude);
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