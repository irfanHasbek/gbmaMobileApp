$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
    showAll(db);
});
function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM dokumanlar", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var item=results.rows.item(i);
                var icerik = JSON.parse(item.icerik);
                var sayfa="dokumanlar";
                console.log("icerik uzunluğu : "+icerik.length);
                if(icerik.length!=0){
                    var dokumanAdi = $('<div class="services text-center"><div class="head-section text-center"><h3 style="color:#fff">'+item.dokumanTuru+'</h3></div></div><div class="services-section "><div class="container"><div class=""><div class="row"><div class="col-xs-12"><table class="table "><thead><tr><th><strong style="color:#fff">Doküman Adı</strong></th><th style="width:10px;color:#fff">Pdf</th></tr> </thead><tbody class="tblDoks'+item._id+'"></tbody></table></div></div></div></div></div></div>');
                $(".divDokuman").append(dokumanAdi);
                for (var j = 0; j < icerik.length; j++) {
                    var dokuman = $('<tr><td style="color:#fff">' +icerik[j].dosyaAdi +'</td><td><a href="http://docs.google.com/viewer?url=' + icerik[j].dosyaLinki +'"><img src="images/pdf.png" style="width:22px" alt=""></a></td></tr>');
                    $(".tblDoks"+item._id).append(dokuman);
                }
             }
            }

        });
    });
}