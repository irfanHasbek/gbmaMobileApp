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

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM yapilmis", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var item = results.rows.item(i);
                var divElem = $(
                    '<br><div class=""><div class="row"><div class="col-xs-12"><h4>' +
                    item.baslik +
                    '</h4></div></div><br><div class="row"><div class="col-xs-12"><img src="' +
                    item.dosyaLinki +
                    '" class="img-responsive" alt=""></div></div><div class="row"><div class="col-xs-12"><p>' +
                    item.aciklama.substring(0, 100) +
                    '..</p><a href="yapilmis_detay.html?id=' +
                    item._id +
                    '" class="btn btn-block btn-default">devamını oku</a></div></div></div><br>'
                );
                $(".divBox").append(divElem);
            }

        });
    });
}

function showItem(database, id) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM yapilmis where _id=" + id, [],
            function(tx,
                results) {
                var item = results.rows.item(0);
                var divElem = $(
                    '<br><div class=""><div class="row"><div class="col-xs-12"><h4>' +
                    item.baslik +
                    '</h4></div></div><br><div class="row"><div class="col-xs-12"><img src="' +
                    item.dosyaLinki +
                    '" class="img-responsive" alt=""></div></div><div class="row"><div class="col-xs-12"><br><p>' +
                    item.aciklama +
                    '..</p></div></div></div><br>'
                );
                $(".divDetail").append(divElem);

            });
    });
}