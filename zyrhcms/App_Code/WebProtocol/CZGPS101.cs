using System;
using System.Data;
using System.Configuration;
using System.Web;
using Zyrh.Common;

/// <summary>
/// CZGPS101 的摘要说明
/// </summary>
public class CZGPS101
{
    public CZGPS101()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static double DMSConvertLatLng(double dms)
    {
        while (dms > 180)
        {
            dms = dms / 10;
        }

        double degree = Math.Floor(dms);
        double minute = dms - degree;

        return GpsLatLng.DMSConvertLatLng(degree, minute, 0, 8);
    }

    public static string LatLngConvertDMS(string strLatLng)
    {
        double[] dms = GpsLatLng.LatLngConvertDMS(strLatLng);
        if (dms[0] >= 0)
        {
            //度数 + 分数 + 小数点 + 分数小数
            return String.Format("{0}{1}.{2}", dms[0], dms[1].ToString().PadLeft(2, '0'), (dms[2] / 60).ToString().PadLeft(4, '0'));
        }
        return string.Empty;
    }

}