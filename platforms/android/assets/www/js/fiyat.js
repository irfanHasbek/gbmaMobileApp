$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
    var id = location.search.split("id=")[1];
    if (id == undefined) {
        showAll(db);
    } else {
        showItem(db, id);
    }
});

function showItem(database, id) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM fiyat where _id="+id, [], function(tx,
            results) {

                var item = results.rows.item(0);
                var icerik = JSON.parse(item.icerik);
                var sayfa="fiyat";
                $("#fiyatGrupAdi").text(item.fiyatGrubu);
                for (var i = 0; i < icerik.length; i++) {
                    var fiyat = $('<tr><td ><span style="color:#fff; font-family:"cardo";">' + icerik[i].dosyaAdi +'</span></td><td><a href="pdfGoruntule.html?sayfa='+sayfa+'&src='+icerik[i].dosyaLinki + '&id=' + id +'" style="color:#fff;"><img style="width:20px" src="images/pdf.png"  alt=""></a></td></tr>');
                    $(".tblFiyat").append(fiyat);
                }

        });
    });
   
}

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM fiyat", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var fiyatGrubu = $(
                    '<div class="col-xs-6 services-section-grid"><a href="fiyat.html?id=' +
                    results.rows.item(i)._id +
                    '"><span class="span13"></span></a><h4>' +
                    results.rows.item(i).urunFiyatGrubu +
                    '</h4></div>');
                $(".fiyatGrubu").append(fiyatGrubu);
            }

        });
    });
}