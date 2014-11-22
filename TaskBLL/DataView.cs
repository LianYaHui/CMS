using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TaskBLL
{
    public class DataView
    {
        public static String ToString(object obj)
        {
            return Convert.ToString(obj);
        }

        public static String ToDateString(object obj, string format)
        {
            if (obj == null || obj == DBNull.Value)
                return "";

            try
            {
                return Convert.ToDateTime(obj).ToString(format);
            }
            catch
            {
                return "";
            }
        }
    }
}
