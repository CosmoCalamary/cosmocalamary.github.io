var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var e=a.length,d=0;d<e;d++){var f=a[d];if(b.call(c,f,d,a))return{i:d,v:f}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};$jscomp.getGlobal=function(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(a,b){var c=$jscomp.propertyToPolyfillSymbol[b];if(null==c)return a[b];c=a[c];return void 0!==c?c:a[b]};
$jscomp.polyfill=function(a,b,c,e){b&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(a,b,c,e):$jscomp.polyfillUnisolated(a,b,c,e))};$jscomp.polyfillUnisolated=function(a,b,c,e){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];if(!(d in c))return;c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})};
$jscomp.polyfillIsolated=function(a,b,c,e){var d=a.split(".");a=1===d.length;e=d[0];e=!a&&e in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var f=0;f<d.length-1;f++){var g=d[f];if(!(g in e))return;e=e[g]}d=d[d.length-1];c=$jscomp.IS_SYMBOL_NATIVE&&"es6"===c?e[d]:null;b=b(c);null!=b&&(a?$jscomp.defineProperty($jscomp.polyfills,d,{configurable:!0,writable:!0,value:b}):b!==c&&($jscomp.propertyToPolyfillSymbol[d]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(d):$jscomp.POLYFILL_PREFIX+d,d=
$jscomp.propertyToPolyfillSymbol[d],$jscomp.defineProperty(e,d,{configurable:!0,writable:!0,value:b})))};$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(b,c){return $jscomp.findInternal(this,b,c).v}},"es6","es3");
function show_success_score(a,b){var c=Math.round(b),e,d='<div role="alert" class=" mb-0 alert score_result color_';15<=c?d+='7">':15>c&&10<=c?d+='6">':10>c&&5<=c?d+='5">':5>c&&3<=c?d+='4">':3>c&&2<=c?d+='3">':2>c&&1<=c?d+='2">':1>c&&(d+='1">');10<=c?e="очень высокий":10>c&&5<=c?e="высокий":5>c&&1<=c?e="умеренный":1>c&&(e="низкий");d=d+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Десятилетний фатальный риск: <b>'+b+"%</b><br/>Риск: <b>"+
e+"</b></div>";jQuery("#"+a).html(d)}
function isCorrectPartFilledArray(a,b){var c=!0;b=!1;for(var e=$jscomp.makeIterator(a),d=e.next();!d.done;d=e.next())d=d.value,""!==jQuery(d).val()?c=!1:jQuery(d).removeClass("is-invalid");if(c)return!0;a=$jscomp.makeIterator(a);for(d=a.next();!d.done;d=a.next())c=d.value,e=parseFloat(jQuery(c).val()),""===jQuery(c).val()?(b=!0,jQuery("#valid_"+jQuery(c).attr("id")).text("Не внесены данные"),jQuery(c).addClass("is-invalid")):isNaN(e)||strEndsWith(e,".")||e<parseFloat(jQuery(c).attr("min"))||e>parseFloat(jQuery(c).attr("max"))?
(b=!0,jQuery("#valid_"+jQuery(c).attr("id")).text("Внесены некорректные данные"),jQuery(c).addClass("is-invalid")):jQuery(c).removeClass("is-invalid");return b?!1:!0}
function isCorrectFilledArray(a,b){for(var c=!0,e=!1,d=$jscomp.makeIterator(a),f=d.next();!f.done;f=d.next())f=f.value,""!==jQuery(f).val()?c=!1:jQuery(f).removeClass("is-invalid");if(c)return jQuery("#result_"+b).html(""),!1;a=$jscomp.makeIterator(a);for(f=a.next();!f.done;f=a.next())c=f.value,d=parseFloat(jQuery(c).val()),""===jQuery(c).val()?(e=!0,jQuery("#valid_"+jQuery(c).attr("id")).text("Не внесены данные"),jQuery(c).addClass("is-invalid")):isNaN(d)||strEndsWith(d,".")?(e=!0,jQuery("#valid_"+
jQuery(c).attr("id")).text("Внесены нечисловые данные"),jQuery(c).addClass("is-invalid")):d<parseFloat(jQuery(c).attr("min"))||d>parseFloat(jQuery(c).attr("max"))?(e=!0,d="Число не в корректном интервале "+jQuery(c).attr("min")+" - "+jQuery(c).attr("max"),jQuery("#valid_"+jQuery(c).attr("id")).text(d),jQuery(c).addClass("is-invalid")):jQuery(c).removeClass("is-invalid");if(!e)return!0;jQuery("#result_"+b).html("");return!1}
function isCorrectFilled(a){var b=!0,c=!1;jQuery("div.calc-"+a).find("input").each(function(e,d){""!==jQuery(d).val()?b=!1:jQuery(d).removeClass("is-invalid")});if(b)return jQuery("#result_"+a).html(""),!1;jQuery("div.calc-"+a).find("input[type=text]").each(function(e,d){e=parseFloat(jQuery(d).val());""===jQuery(d).val()?(c=!0,jQuery("#valid_"+jQuery(d).attr("id")).text("Не внесены данные"),jQuery(d).addClass("is-invalid")):isNaN(e)||strEndsWith(e,".")?(c=!0,jQuery("#valid_"+jQuery(d).attr("id")).text("Внесены нечисловые данные"),
jQuery(d).addClass("is-invalid")):e<parseFloat(jQuery(d).attr("min"))||e>parseFloat(jQuery(d).attr("max"))?(c=!0,e="Число не в корректном интервале "+jQuery(d).attr("min")+" - "+jQuery(d).attr("max"),jQuery("#valid_"+jQuery(d).attr("id")).text(e),jQuery(d).addClass("is-invalid")):jQuery(d).removeClass("is-invalid")});return c?(jQuery("#result_"+a).html(""),!1):!0}function strEndsWith(a,b){return-1!==b.indexOf(a)&&b.indexOf(a)+a.length===b.length}
function convert(a){var b,c="";for(b=0;b<a.length;b++)c=","===a.charAt(b)?c+".":c+a.charAt(b);return c}function rnd(a){return Math.round(100*a)/100}function rnd_1(a){return Math.round(10*a)/10}function isDate(a){arr=a.split(".");return 3!==arr.length||1990>parseInt(a[2],10)||2030<parseInt(a[2],10)?!1:!0}function show_success(a,b){show_cust("info",a,b)}function show_error(a,b){show_cust("warning",a,b)}
function show_cust(a,b,c){a='<div class="alert alert-'+a+' mt-3 mb-0" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span>';a+="</button>";a+=c;a+="</div>";jQuery("#"+b).html(a)}function getPointScored(a){return"Набрано: <b>"+a+" "+getRightNameMark(a)+"</b>"}
function getRightNameMark(a){a=a.toString();2<a.length&&(a=a.substr(a.length-2,2));if(2===a.length&&"1"===a.substr(0,1))return"баллов";a=a.substr(a.length-1,1);return"1"===a?"балл":"2"===a||"3"===a||"4"===a?"балла":"баллов"}function getRightNameRepeat(a){a=a.toString();2<a.length&&(a=a.substr(a.length-2,2));if(2===a.length&&"1"===a.substr(0,1))return"повторений";a=a.substr(a.length-1,1);return"1"===a?"повторение":"2"===a||"3"===a||"4"===a?"повторения":"повторений"}
function button_push(a){window["handler_"+a]()}function getSex(a){return jQuery("#male_"+a).is(":checked")?"male":"female"}function handler_clear(){jQuery("#result_"+arguments[0]).html("");for(var a=1;a<arguments.length;a++){var b=document.getElementById(arguments[a]+"_"+arguments[0]);jQuery(b).removeClass("is-invalid");"text"===b.type?b.value="":"select-one"===b.type?b.options[0].selected="true":"radio"===b.type?b.checked=!1:"checkbox"===b.type&&(b.checked=!1)}}
function handler_clear_w_res(){for(var a=1;a<arguments.length;a++){var b=document.getElementById(arguments[a]+"_"+arguments[0]);jQuery(b).removeClass("is-invalid");"text"===b.type?b.value="":"select-one"===b.type?b.options[0].selected="true":"radio"===b.type?b.checked=!0:"checkbox"===b.type&&(b.checked=!1)}window["handler_"+arguments[0]]()}window.onload=function(){if(window.jQuery){var a=getSearchString();"undefined"!==typeof a&&""!==a&&search_push2()}};
function getSearchString(){var a=jQuery.trim(jQuery("#search-calc").val()),b=jQuery.trim(jQuery("#search-calc-small").val());return"undefined"===a&&"undefined"===b?"undefined":""===a&&""===b?"":""!==a?a:b}
function search_push2(){var a=getSearchString();servData={};"undefined"!==typeof a&&(""===a?(servData.sender="searchingCalcsForSubtitle",servData.search_txt=jQuery("#all-calcs").attr("subtitle")):(servData.sender="searchingCalcs",servData.search_txt=a),jQuery.ajax({type:"POST",url:"index.php?option=com_ajax&group=content&plugin=msfcalcs_bsp4&format=json",data:servData,success:function(b){console.log(b);b=b.data[0].data;jQuery("#all-calcs").html(b.htmlCalcs);""===a?(jQuery('h1[itemprop="headline"]').html(jQuery("#all-calcs").attr("subtitle")),
"Калькуляторы"===jQuery("#all-calcs").attr("subtitle")&&jQuery("#hr-subtitle").addClass("d-none")):("Калькуляторы"===jQuery("#all-calcs").attr("subtitle")&&jQuery("#hr-subtitle").removeClass("d-none"),jQuery('h1[itemprop="headline"]').html("Найдено калькуляторов: "+b.count));prepareSrc()},error:function(b){alert("error "+b)}}))}
function getCheckBoxSum(a){var b=0;jQuery("div.calc-"+a).find("input[type=checkbox]").each(function(c,e){c=0;jQuery(e).is(":checked")&&(c=parseFloat(jQuery(e).attr("value")));b+=c});return b}function getRBVal(a){var b=0;jQuery("div.calc-"+a).find("input[type=radio]").each(function(c,e){c=0;jQuery(e).is(":checked")&&(c=parseFloat(jQuery(e).attr("value")));isNaN(c)||(b+=c)});return b}function instr(a,b){return-1!==a.toLowerCase().indexOf(b.toLowerCase())}
function startsWith(a,b){return 0===a.toLowerCase().indexOf(b.toLowerCase())}function toAjax(a,b){jQuery.ajax({type:"POST",url:"index.php?option=com_ajax&group=content&plugin=msfcalcs_bsp4&format=json",data:b,success:function(c){c=c.data[0].data;c.success?show_success("result_"+a,c.result):show_error("result_"+a,c.result)}})}function input_search_push(a){13===a.keyCode&&search_push2()};