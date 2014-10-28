using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Newtonsoft.Json;

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
    }
}
