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
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Led;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Led;

public partial class modules_ledScreen_sub_frmType : System.Web.UI.Page
{
    protected InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);

    //下拉列表控件最大数量
    protected int maxCount = 20;
    //是否显示所有下拉列表控件
    protected bool isShowAll = false;
    //是否显示没有数据的下拉列表控件
    protected bool isShowNull = true;
    protected int typeId = 0;
    protected bool isParent = true;
    protected int parentId = 0;
    protected int maxLevel = 0;
    protected int[] arrId = new int[1];
    protected string strHasType = "false";

    protected bool isSetFocus = true;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.arrId = new int[maxCount];

        this.InitialTypeControl();

        if (!IsPostBack)
        {
            this.Initial();
            this.GetInfoType();
        }
    }

    #region  初始化
    protected void Initial()
    {
        try
        {
            this.typeId = Public.RequestString("typeId", 0);
            this.isParent = Public.RequestString("isParent", 0) == 1;
            this.parentId = Public.RequestString("parentId", 0);
            this.isSetFocus = Public.RequestString("isSetFocus", 1) == 1;

            this.txtTypeId.Value = this.typeId.ToString();
            this.txtParentId.Value = this.parentId.ToString();

            if (isParent)
            {
                this.txtResultId.Value = this.parentId.ToString();
                if (this.parentId > 0)
                {
                    this.InitialTypeIdArray(this.parentId);
                }
            }
            else
            {
                this.txtResultId.Value = this.txtTypeId.ToString();
                if (this.typeId > 0)
                {
                    this.InitialTypeIdArray(this.typeId);
                }
            }
        }
        catch (Exception ex) { }
    }
    #endregion


    #region  获得分类
    public void InitialTypeIdArray(int typeId)
    {
        if (typeId <= 0)
        {
            return;
        }
        InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
        DBResultInfo dbResult = tm.GetSingleInfoType(typeId);
        DataSet ds = dbResult.dsResult;
        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            DataRow dr = ds.Tables[0].Rows[0];
            InfoTypeInfo module = tm.FillInfoTypeInfo(dr);
            char[] delimiter = { ',' };
            string[] arrParentIdList = tm.ParseParentTree(module.ParentTree).Split(delimiter, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < arrParentIdList.Length; i++)
            {
                this.arrId[i] = Convert.ToInt32(arrParentIdList[i]);
            }
        }
    }

    public void BuildTypeIdArray()
    {
        int total = 0;
        int step = 0;
        for (int i = 0; i < this.arrId.Length; i++)
        {
            DropDownList drpType = GetTypeControl(i);
            int typeId = Convert.ToInt32(drpType.SelectedValue.ToString());

            this.arrId[i] = typeId;
            if (typeId > 0)
            {
                this.txtResultId.Value = typeId.ToString();
                step++;
            }
            else
            {
                break;
            }
        }
        for (int i = 0; i < step; i++)
        {
            if (total > 0)
            {
                break;
            }
            total += this.arrId[i];
        }

        if (total == 0)
        {
            this.txtResultId.Value = "0";
        }
    }

    public DropDownList GetTypeControl(int id)
    {
        return (DropDownList)this.phType.FindControl("ddlType" + id.ToString());
    }

    public void InitialTypeControl()
    {
        for (int i = 0; i < this.arrId.Length; i++)
        {
            DropDownList drpType = GetTypeControl(i);
            drpType.AutoPostBack = true;
            drpType.SelectedIndexChanged += new EventHandler(drpType_SelectedIndexChanged);
            drpType.Visible = isShowAll;
        }
    }

    public void GetInfoType()
    {
        try
        {
            InfoTypeManage tm = new InfoTypeManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = tm.GetInfoType(1, -1, -1);
            DataSet ds = dbResult.dsResult;
            this.maxLevel = tm.GetInfoTypeMaxLevel();
            this.typeId = DataConvert.ConvertValue(this.txtTypeId.Value.Trim(), 0);

            int showCount = 0;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                int idx = 0;
                for (int i = 0; i < this.arrId.Length; i++)
                {
                    DropDownList drpType = GetTypeControl(i);
                    drpType.Items.Clear();
                    drpType.SelectedIndex = -1;
                    ListItem li1 = new ListItem("请选择分类", "0");
                    drpType.Items.Add(li1);

                    string strFilter = "level = " + i + (i > 0 ? " and parent_id=" + this.arrId[i - 1] : "")
                        + (this.typeId > 0 && this.isParent ? " and type_id <> " + this.typeId : ""); //不能将自己作为父级对象

                    DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);
                    int count = dv.Count;
                    if (count > 0)
                    {
                        foreach (DataRowView drv in dv)
                        {
                            InfoTypeInfo module = tm.FillInfoTypeInfo(drv);
                            ListItem li = new ListItem(module.TypeName, module.TypeId.ToString());
                            drpType.Items.Add(li);
                        }

                        drpType.SelectedIndex = drpType.Items.IndexOf(drpType.Items.FindByValue(this.arrId[i].ToString()));
                        bool isShow = i <= this.maxLevel;
                        drpType.Visible = isShow;
                        if (isShow)
                        {
                            showCount++;
                        }
                        idx++;
                    }
                    else
                    {
                        break;
                    }
                }
                for (int i = idx; i < this.arrId.Length; i++)
                {
                    DropDownList drpType = GetTypeControl(i);
                    drpType.Items.Clear();
                    ListItem li1 = new ListItem("请选择分类", "0");
                    drpType.Items.Add(li1);

                    if (!isShowNull)
                    {
                        bool isShow = i <= this.maxLevel;
                        //是否显示没有数据的下拉列表
                        drpType.Visible = isShow;
                        if (isShow)
                        {
                            showCount++;
                        }
                    }
                }
                this.strHasType = "true";

                if (0 == showCount)
                {
                    DropDownList drpTypeFirst = GetTypeControl(0);
                    drpTypeFirst.Visible = true;
                }
            }
            else
            {
                this.strHasType = "false";
                this.lblError.InnerHtml = "<span style=\"color:#f00;margin-right:10px;\">没有分类，请先添加分类</span><a onclick=\"reload();\">刷新分类</a>";
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion


    #region  筛选分类
    protected void drpType_SelectedIndexChanged(object sender, EventArgs e)
    {
        this.BuildTypeIdArray();
        this.GetInfoType();
        //分类加载后重新再获取一次分类ID
        this.BuildTypeIdArray();
    }
    #endregion

}
