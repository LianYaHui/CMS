using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_UpLoadExcel : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        switch (Request["action"])
        {
            case "save":
                string uploadpath = Server.MapPath(Request["folder"] + "\\");
                HttpPostedFile file = Request.Files["FileData"];


                if (!Directory.Exists(uploadpath))
                    Directory.CreateDirectory(uploadpath);

                if (file == null)
                {
                    Response.Write("0");
                    Response.End();
                }

                file.SaveAs(uploadpath + file.FileName);
                FileInfo file_info = new FileInfo(uploadpath + file.FileName);

                String OleString = null;
                switch (file_info.Extension)
                {
                    case ".xls":
                        OleString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='{0}';Extended Properties=Excel 8.0", file_info.FullName);
                        break;
                    case ".xlsx":
                        OleString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source='{0}';Extended Properties=Excel 12.0", file_info.FullName);
                        break;
                }

                String selectSql = "select * from [Sheet1$]";

                FoxzyDBSql.OleDb.OleDbManageUtil db = new FoxzyDBSql.OleDb.OleDbManageUtil(OleString);
                var ds = db.FillDataSet(selectSql, null, CommandType.Text);

                int _succCount = 0;
                int waimmingCount = 0;
                TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();
                String guid = Guid.NewGuid().ToString();

                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    try
                    {
                        var lineInfo = bll.GetPatrolLineByName(Convert.ToString(row["所属区域"]));
                        var pointTypeInfo = bll.GetPatrolTypeByName(Convert.ToString(row["巡检点类型"]));



                        var pointInfo = new
                        {
                            create_time = DateTime.Now,
                            point_name = row["巡检点名称"],
                            longitude = Convert.ToDouble(row["经度"]),
                            latitude = Convert.ToDouble(row["维度"]),
                            type_id = pointTypeInfo == null ? 0 : pointTypeInfo["type_id"],
                            line_id = lineInfo == null ? 0 : lineInfo["line_id"],
                            is_delete = false,
                            area_id = 0,
                            guid = guid
                        };
                        bll.Insert("patrol_point", pointInfo);

                        _succCount++;
                    }
                    catch (Exception ex)
                    {
                        waimmingCount++;
                    }


                }

                DataTable result = bll.SelectPointByGUID(guid);

                Response.Write(new
                {
                    result = result.ToDictionary(),
                    insertCount = _succCount
                }.ObjectToJsonString());
                Response.End();
                break;
        }
    }
}