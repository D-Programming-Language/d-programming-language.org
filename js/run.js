/**
Runnable examples functionality

Copyright: 2012 by Digital Mars

License:   http://boost.org/LICENSE_1_0.txt, Boost License 1.0

Authors:   Andrei Alexandrescu, Damian Ziemba
*/

/**
Taken from http://www.webtoolkit.info/javascript-md5.html
*/
var MD5 = function (string) {
 
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
 
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
    return temp.toLowerCase();
}

String.prototype.nl2br = function()
{      
    return this.replace(/\n/g, "<br />");     
}

function showHideAnswer(zis)
{
    var id = $(zis).attr('id').replace(/[^\d]/g,'');
    var obj= $("#a"+id);

    if (obj.css('display') == 'none')
    {
        $(zis).html('<span class="nobr">Hide example.</span>');
        obj.css('display', 'block');
    }
    else
    {
        $(zis).html('<span class="nobr">See example.</span>');
        obj.css('display', 'none');
    }
}

function parseOutput(data, o, oTitle)
{
    var xml = $(data);
    if (xml == null || xml.find("response") == null)
    {
        o.text("Temporarily unavaible");
        return;
    }

    var output = "";
    var cout = xml.find("response").find("compilation").find("stdout").text();
    var stdout = xml.find("response").find("runtime").find("stdout").text();
    var stderr = xml.find("response").find("runtime").find("stderr").text();
    var ctime = parseInt(xml.find("response").find("compilation").find("time").text());
    var rtime = parseInt(xml.find("response").find("runtime").find("time").text());
    var cstatus = parseInt(xml.find("response").find("compilation").find("status").text());
    var rstatus = parseInt(xml.find("response").find("runtime").find("status").text());
    var cerr = xml.find("response").find("compilation").find("err").text();
    var rerr = xml.find("response").find("runtime").find("err").text();

    if (cstatus != 0)
    {
        oTitle.text("Compilation output ("+cstatus+": "+cerr+")");
        if ($.browser.msie)
            o.html(cout.nl2br());
        else
            o.text(cout);
        
        return;
    }
    else
    {
        oTitle.text("Application output");// (compile "+ctime+"ms, run "+rtime+"ms)");
        if ( cout != "")
            output = 'Compilation output: \n' + cout + "\n";
        
        output += (stdout == "" && stderr == "" ? '-- No output --' : stdout);

        if (stderr != "") 
            output += stderr;

        if (rstatus != 0)
            oTitle.text("Application output ("+rstatus+": "+rerr+")");
    }

    if ($.browser.msie)
        o.html(output.nl2br());
    else
        o.text(output);
}

$(document).ready(function() 
{
    $('pre[class=d_code]').each(function(index) 
    {
        if (mainPage[MD5($(this).text())] != null)
        {
            var currentExample = $(this);
            var orig = currentExample.html();
            var elements = mainPage[MD5($(this).text())];

            currentExample.replaceWith(
                '<div class="d_code"><pre class="d_code">'+orig+'</pre></div>'
                + '<div class="d_run_code">'
                + '<textarea class="d_code" style="display: none;"></textarea>'
                + '<div class="d_code_stdin"><span class="d_code_title">Standard input</span><br />'
                + '<textarea class="d_code_stdin">'+(elements[0] != null ? elements[0] : '')+'</textarea></div>'
                + '<div class="d_code_args"><span class="d_code_title">Command line arguments</span><br />'
                + '<textarea class="d_code_args">'+(elements[1] != null ? elements[1] : '')+'</textarea></div>'
                + '<div class="d_code_output"><span class="d_code_title">Application output</span><br /><textarea class="d_code_output" readonly>Running...</textarea></div>'
                + '<input type="button" class="editButton" value="Edit">'
                + '<input type="button" class="argsButton" value="Args">'
                + '<input type="button" class="inputButton" value="Input">'
                + '<input type="button" class="runButton" value="Run">'
                + '<input type="button" class="resetButton" value="Reset"></div>'
            );
        }
        //else
            //console.log(MD5($(this).text()));
    });
    
    $('textarea[class=d_code]').each(function(index) {
        var thisObj = $(this);

        var parent = thisObj.parent();
        parent.css("display", "block");
        var orgSrc = parent.parent().children("div.d_code").children("pre.d_code");

        var prepareForMain = function()
        {
            var src = $.browser.msie && $.browser.version < 9.0 ? orgSrc[0].innerText : orgSrc.text();
            var arr = src.split("\n");
            var str = "";
            for ( i = 0; i < arr.length; i++)
            {
                str += arr[i]+"\n";
            }
            if ($.browser.msie && $.browser.version < 9.0)
                str = str.substr(0, str.length - 1);
            else
                str = str.substr(0, str.length - 2);

            return str;
        };

        var editor = CodeMirror.fromTextArea(thisObj[0], {
            lineNumbers: true,
            tabSize: 4,
            indentUnit: 4,
            indentWithTabs: true,
            mode: "text/x-d",
            lineWrapping: true,
            theme: "eclipse",
            readOnly: false,
            matchBrackets: true
        });

        editor.setValue(prepareForMain());

        var height = function(diff) {
            var par = code != null ? code : parent.parent().children("div.d_code");
            return (parseInt(par.css('height')) - diff) + 'px';
        };

        var runBtn = parent.children("input.runButton");
        var editBtn = parent.children("input.editButton");
        var inputBtn = parent.children("input.inputButton");
        var resetBtn = parent.children("input.resetButton");
        var argsBtn = parent.children("input.argsButton");
        var stdinDiv = parent.children("div.d_code_stdin");
        var argsDiv = parent.children("div.d_code_args");
        var outputDiv = parent.children("div.d_code_output");

        var code = $(editor.getWrapperElement());
        code.css('display', 'none');

        var output = outputDiv.children("textarea.d_code_output");
        var outputTitle = outputDiv.children("span.d_code_title");
        var stdin = stdinDiv.children("textarea.d_code_stdin");
        var args = argsDiv.children("textarea.d_code_args");
        var orgArgs = args.val();
        var orgStdin = stdin.val();

        var hideAllWindows = function()
        {
            stdinDiv.css('display', 'none');
            argsDiv.css('display', 'none');
            outputDiv.css('display', 'none');
            parent.parent().children("div.d_code").css('display', 'none');
            code.css('display', 'none');
        };

        argsBtn.click(function(){
            resetBtn.css('display', 'inline-block');
            args.css('height', height(31));
            hideAllWindows();
            argsDiv.css('display', 'block');
            args.focus();
        });

        inputBtn.click(function(){
            resetBtn.css('display', 'inline-block');
            stdin.css('height', height(31));
            hideAllWindows();
            stdinDiv.css('display', 'block');
            stdin.focus();
        });
        editBtn.click(function(){
            resetBtn.css('display', 'inline-block');
            hideAllWindows();
            code.css('display', 'block');
            editor.refresh();
            editor.focus();
        });
        resetBtn.click(function(){
            resetBtn.css('display', 'none');
            editor.setValue(prepareForMain());
            args.val(orgArgs);
            stdin.val(orgStdin);
            hideAllWindows();
            parent.parent().children("div.d_code").css('display', 'block');
        });
        runBtn.click(function(){
            resetBtn.css('display', 'inline-block');
            $(this).attr("disabled", true);
            hideAllWindows();
            output.css('height', height(31));
            outputDiv.css('display', 'block');
            outputTitle.text("Application output");
            output.html("Running...");
            output.focus();
           
            $.ajax({
                type: 'POST',
                url: "/process.php",
                dataType: "xml",
                data: 
                {
                    'code' : encodeURIComponent(editor.getValue()), 
                    'stdin' : encodeURIComponent(stdin.val()), 
                    'args': encodeURIComponent(args.val())
                },
                success: function(data) 
                {
                    parseOutput(data, output, outputTitle);
                    runBtn.attr("disabled", false);
                },
                error: function() 
                {
                    output.html("Temporarily unavaible");
                    runBtn.attr("disabled", false);
                }
            });
        });
    });

    $("div.answer-nojs").each(function(index) {
        $(this).css("display", "none");
    });
});