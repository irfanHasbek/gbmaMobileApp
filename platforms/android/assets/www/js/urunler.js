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
        tx.executeSql("SELECT*FROM urunler where _id=" + id, [],
            function(tx,  results) {
                var item = results.rows.item(0);
                var icerik = JSON.parse(item.icerik);
                console.log(icerik);
                var sayfa="urunler";
                $("#urunGrubu").text(item.urunGrubu);
                for (var i = 0; i < icerik.length; i++) {
                    var urun = $('<tr><td ><span style="color:#fff">' + icerik[i].dosyaAdi +'</span></td><td><a href="pdfGoruntule.html?src='+icerik[i].dosyaLinki + '&id=' + id +'&sayfa='+sayfa+'" style="color:#fff;"><img style="width:20px" src="images/pdf.png"  alt=""></a></td></tr>');
                    $(".tblUrun").append(urun);
                }
            });
    });
}

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM urunler", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var urunGrubu = $(
                    '<div class="col-xs-6 services-section-grid"><a href="urunGrubu.html?id=' +
                    results.rows.item(i)._id +
                    '"><span class="span13"></span></a><h4>' +
                    results.rows.item(i).urunGrubu +
                    '</h4></div>');
                $(".urunGrubu").append(urunGrubu);
            }

        });
    });
}