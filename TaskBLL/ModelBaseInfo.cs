using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// ModelBaseInfo 的摘要说明
/// </summary>
public class ModelBaseInfo
{
    public virtual int ID { set; get; }

    public virtual bool Enable { set; get; }

    public virtual DateTime CreateTime { set; get; }

    public virtual String CreateAccount { set; get; }


}