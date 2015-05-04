$(document).ready(function() {
    var src = getParam("src");
    var id= getParam("id");
    var sayfa=getParam("sayfa");
    var frame = $('<iframe id="' + id + '" src="http://docs.google.com/gview?url=' + src +
        '&embedded=true" style="width:100%; height:100%;" frameborder="0"></iframe>');
    $(".src").append(frame);
    if (sayfa == "urunler") {
        $("#urunler").attr("href", "urunGrubu.html?id=" + id);
    } else if(sayfa=="dokumanlar") {
        $("#urunler").attr("href", "dokumanlar.html");
    }else if(sayfa=="fiyat"){
        $("#urunler").attr("href", "fiyat.html?id=" + id);
    }
});
function getParam(name)
        {  
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
            var regexS = "[\\?&]"+name+"=([^&#]*)";  
            var regex = new RegExp( regexS );  
            var results = regex.exec(window.location.href);
            if(results == null)
                return "";  
            else    
                return results[1];
        }