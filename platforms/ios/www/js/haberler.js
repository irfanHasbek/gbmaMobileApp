$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
        showAll(db);
});

function addItemToHtml(item) {
    var image=item.fotografLinki;
   var haberLinki=item.haberLinki.replace("https","http");
    var divElem = $('<div class="thumb-box3"><div class="col-xs-12 no-padding"><div class="thumb-pad1"><div class="thumbnail"><figure><img src="' +
       image + '" alt=""></figure><div class="caption"><strong>'+item.haberAdi + '/' + item.tarih + '</strong><p>' + item.aciklama.substring(0, 100)+
        '... <a  href="'+haberLinki+'" style="color:#52a1d9; text-decoration:underline;">devamı</a></p></div></div></div></div></div><br>');
    $(".haberler").append(divElem);
}

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM haberler", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var item = results.rows.item(i);
                addItemToHtml(item);
            }

        });
    });
}