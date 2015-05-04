$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
        showAll(db);
});

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM egitim_takvimi", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var item = results.rows.item(i);
                var tblElem = $(
                    '<tr><td>'+item.tarih+'</td><td>'+item.yer+'</td><td>'+item.konu+'</td></tr>'
                );
                $(".tblEgitimTakvimi").append(tblElem);

        }
    });
});
                        }