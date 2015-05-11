$(document).ready(function(){
    var hata=location.search.split("hata=")[1];
    var mesaj="";
    if(hata==500){
        mesaj="Veritabanı yüklenemedi.Lütfen uygulamanızı yeniden başlatınız.";
    }else if(hata==404){
        mesaj="Veri Yüklerken hata oluştu.Lütfen bağlantınızı kontrol edip yeniden başlatınız.";
    }else if(hata==300){
        mesaj="internet bağlantınız yok.";
    }
    $("#mesaj").append(mesaj);
});