/*---LEFT BAR ACCORDION----*/
var mainActiveId;
var firstUrl = null;//第一个页面
var secondUrl = null;//第二个页面
var flag = 1;
$(function() {
	loadFavorites();
});

function loadFavorites(){
	$.ajax({
		async: false,
		type: 'POST',
		dataType: 'json',
		url: '/user/getFavorites',
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		},
		success: function(favorites){
			initDatas(favorites);
		}
	});
}

function initDatas(favorites){
	for(var i=0;i<favorites.length;i++){
		var id = favorites[i].id ;
		var name = favorites[i].name;
		var count = favorites[i].count;
		var url ='/standard/'+ id;
		if(name=="未读列表"){
			var favorite="<a href=\"javascript:void(0);\" onclick=\"locationUrl('"+url+"','unread')\" title="+name+" >";
			favorite=favorite+"<div class=\"label label-success pull-right\">"+count+"</div>";
			favorite=favorite+"<em class=\"icon-paper-clip\"></em>";
			favorite=favorite+"<span>"+name+"</span>";
			favorite=favorite+"</a>";
			$("#unread").append(favorite)
		}else{
			var favorite="<li id="+id+">";
			favorite=favorite+"<a href=\"javascript:void(0);\" onclick=\"locationUrl('"+url+"','"+id+"')\" title="+name+" >";
			favorite=favorite+"<div class=\"text-muted mr pull-right\">"+count+"</div>";
			favorite=favorite+"<span>"+name+"</span>";
			favorite=favorite+"</a></li>";
			$("#newFavortes").after(favorite)
		}
	}
}


function locationUrl(url,activeId){
	if(mainActiveId != null && mainActiveId != ""){
		var acrr = mainActiveId.split("-");
		if(acrr.length = 3){
			//二级
			var fatherActive = acrr[1]+"-"+acrr[2];
			$("#"+mainActiveId).removeAttr("class");
			$("#"+fatherActive).removeAttr("class");
		}else{
			//一级
			$("#"+mainActiveId).removeAttr("class");
		}
	}
	if(activeId != null && activeId != ""){
		var acrr = activeId.split("-");
		if(acrr.length = 3){
			//二级
			var fatherActive = acrr[1]+"-"+acrr[2];
			$("#"+activeId).attr("class", "active");
			$("#"+fatherActive).attr("class", "active");
		}else{
			//一级
			$("#"+activeId).attr("class", "active");
		}
		mainActiveId = activeId;
	}
	goUrl(url,null);
}

var xmlhttp = new getXMLObject();
function goUrl(url,params) {
	fixUrl(url,params);
	if(xmlhttp) {
		//var params = "";
		xmlhttp.open("POST",url,true); 
		xmlhttp.onreadystatechange = handleServerResponse;
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		xmlhttp.send(params); 
	}
}

function fixUrl(url, params){
	if(params != null){
		url = url + "?" + params;
	}
	if(firstUrl == null){
		firstUrl = url;
	}else if(secondUrl == null){
		secondUrl = url;
	}else{
		if(flag == 1){
			firstUrl = url;
			flag = 2;
		}else{
			secondUrl = url;
			flag = 1;
		}
	}
}

/**
 * 后退
 */
function historyBack(){
	if(flag == 1){
		goUrl(firstUrl);
	}else{
		goUrl(secondUrl);
	}
}


//XML OBJECT
function getXMLObject() {
	var xmlHttp = false;
	try {
		xmlHttp = new ActiveXObject("Msxml2.XMLHTTP") // For Old Microsoft
														// Browsers
	} catch (e) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP") // For Microsoft
																// IE 6.0+
		} catch (e2) {
			xmlHttp = false // No Browser accepts the XMLHTTP Object then false
		}
	}
	if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
		xmlHttp = new XMLHttpRequest(); // For Mozilla, Opera Browsers
	}
	return xmlHttp; // Mandatory Statement returning the ajax object created
}

function handleServerResponse() {
	if (xmlhttp.readyState == 4) {
		//document.getElementById("mainSection").innerHTML =xmlhttp.responseText;
		$("#content").html(xmlhttp.responseText);
	}
}

function showContent(url){
	$.get("/html/"+url+".html", function(data){
		$("#main-content").html(data);
		initContentPage();
	},"html");
}

