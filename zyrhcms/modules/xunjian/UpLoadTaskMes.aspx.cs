﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using TaskBLL;

public partial class modules_xunjian_UpLoadTaskMes : System.Web.UI.Page
{
    protected String AudioUrl = "[]",
        VidioUrl = "[]";

    protected void Page_Load(object sender, EventArgs e)
    {
        TaskBLL.TaskBLL bll = new TaskBLL.TaskBLL();

        String _id = Request["id"];

        if (String.IsNullOrEmpty(_id))
            return;

        System.Data.DataRow info = bll.GetDeviceTaskInfo(Convert.ToInt32(_id));

        sp_leaderDesc.InnerHtml = String.Format("<p>{0}</p><p>{1}</p>",
            TaskBLL.DataView.ToString(info["leaderDesc"]),
            TaskBLL.DataView.ToDateString(info["descDate"], "yyyy-MM-dd HH:mm:ss"));

        String mark = DataView.ToString(info["MarkID"]);

        if (String.IsNullOrEmpty(mark))
            return;

        var upInfos = bll.GetUploadTaskInfo(mark);

        if (upInfos == null)
            return;

        var lqInfos = upInfos.Rows.OfType<System.Data.DataRow>();

        rpt_Image.DataSource = lqInfos.Where(r => Convert.ToInt32(r["UpLoadType"]) == Convert.ToInt32(UpLoadFileType.Image));
        rpt_Image.DataBind();

        AudioUrl = (from row in lqInfos
                    where Convert.ToInt32(row["UpLoadType"]) == Convert.ToInt32(UpLoadFileType.Audio)
                    select new
                    {
                        title = Convert.ToString(row["FileName"]),
                        mp3 = Convert.ToString(row["UpLoadURL"])
                    }).ObjectToJsonString();

        VidioUrl = (from row in lqInfos
                    where Convert.ToInt32(row["UpLoadType"]) == Convert.ToInt32(UpLoadFileType.Vidio)
                    select new
                    {
                        title = Convert.ToString(row["FileName"]),
                        m4v = Convert.ToString(row["UpLoadURL"])
                    }).ObjectToJsonString();


        StringBuilder text = new StringBuilder();
        foreach (System.Data.DataRow row in lqInfos.Where
            (r => Convert.ToInt32(r["UpLoadType"]) == Convert.ToInt32(UpLoadFileType.Text)))
        {
            text.AppendFormat("<p>{0}:{1}</p>",
                DataView.ToDateString(row["UploadDate"], "yyyy-MM-dd HH:mm:ss"),
                Convert.ToString(row["UpLoadText"]));
        }

        upTextDiv.InnerHtml = text.ToString();
    }
}