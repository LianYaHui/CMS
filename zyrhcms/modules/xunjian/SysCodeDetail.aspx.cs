using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_SysCodeDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        var _id = Request.QueryString["ID"] ?? "0";

        int __id = Convert.ToInt32(_id);

        CodeForm.Attributes["data-id"] = _id;
        String sqlFillType = "select * from codeinfo where CodeType =0 and Enable=1";
        var db = DBUtil.CreateMySqlDB();
        var _dataSet = db.FillDataSet(sqlFillType, null, System.Data.CommandType.Text);

        slt_codeType.Items.Add(new ListItem("父类", "0"));
        foreach (DataRow _info in _dataSet.Tables[0].Rows)
            slt_codeType.Items.Add(new ListItem(Convert.ToString(_info["Value"]), Convert.ToString(_info["Code"])));

        if (__id > 0)
        {
            String sql = "select * from codeinfo where ID=" + __id;
            var ds = db.FillDataSet(sql, null, CommandType.Text);

            if (ds.Tables[0].Rows.Count == 1)
            {
                DataRow row = ds.Tables[0].Rows[0];

                txt_CodeDisplay.Text = Convert.ToString(row["Value"]);
                ck_isEnable.Checked = Convert.ToBoolean(row["Enable"]);
                slt_codeType.Value = Convert.ToString(row["CodeType"]);
                txt_code_cd.Text = Convert.ToString(row["Code"]);
            }
        }
    }
}