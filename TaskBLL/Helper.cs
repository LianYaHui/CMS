using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Newtonsoft.Json;
using System.IO;

namespace TaskBLL
{
    public static class Helper
    {
        public static List<Dictionary<string, object>> ToDictionary(this DataTable table)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();

            foreach (DataRow dr in table.Rows)
            {
                Dictionary<string, object> row = new Dictionary<string, object>();
                foreach (DataColumn dc in table.Columns)
                    row.Add(dc.ColumnName, dr[dc]);
                list.Add(row);
            }
            return list;
        }

        public static String ToJsonString(this DataTable table)
        {
            return JsonConvert.SerializeObject(table.ToDictionary());
        }

        public static String ObjectToJsonString(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T JsonStringToDictionary<T>(this String json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }



        public static String GetFileName(String path, bool isCheckFile = false)
        {
            if (isCheckFile)
            {
                if (File.Exists(path))
                    throw new Exception(String.Format("文件{0}不存在", path));
            }


            return path.Substring(path.LastIndexOf("/") + 1);
        }

    }
}
