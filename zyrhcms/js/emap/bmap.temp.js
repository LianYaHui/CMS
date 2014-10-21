
var gb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function hb(a) {
    var b = "",
    c,
    d,
    e = "",
    g,
    i = "",
    j = 0;
    g = /[^A-Za-z0-9\+\/\=]/g;
    if (!a || g.exec(a)) return a;
    a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do{
        //每四位截取一次，比如第一次为MTE2
        c = gb.indexOf(a.charAt(j++));
        d = gb.indexOf(a.charAt(j++));
        g = gb.indexOf(a.charAt(j++));
        i = gb.indexOf(a.charAt(j++));
        // console.log(j+'::'+c+':'+d+':'+g+':'+i);
        c = c << 2 | d >> 4;
        d = (d & 15) << 4 | g >> 2;
        e = (g & 3) << 6 | i;
        // console.log(j+'::'+c+':'+d+':'+e);
        b += String.fromCharCode(c);
        // console.log(j+'::'+c+':'+b);
        64 != g && (b += String.fromCharCode(d));
        64 != i && (b += String.fromCharCode(e));
    }while (j < a.length);
    return b;
}

bmap.translate = function(gpsPoint, offset, callBack){

};