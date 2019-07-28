/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
function json2xml(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m1 in v) {
            if (m1.charAt(0) === "@")
               xml += " " + m1.substr(1) + "=\"" + v[m1].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m2 in v) {
               if (m2 === "#text")
                  xml += v[m2];
               else if (m2 === "#cdata")
                  xml += "<![CDATA[" + v[m2] + "]]>";
               else if (m2.charAt(0) !== "@")
                  xml += toXml(v[m2], m2, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)==="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

function arrayToXml(arr, parentName, childName) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += `<${parentName}>`;
  arr.forEach((item, index) => 
    xml += 
        `<${childName} index="${index}">` + 
        json2xml(item) +  
        `</${childName}>`
  );
  xml += `</${parentName}>`;
  return xml;
}

export default arrayToXml;