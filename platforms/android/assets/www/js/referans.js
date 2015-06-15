$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
    showAll(db);
});

function addImgSrc(item, id) {
    for (var i = 0; i < item.length; i++) {
        var d = 12 / item.length;
        var imgSrc = ('<div class="col-xs-' + d + '"><img src="' + item[i] +
            '" title="" class="img-responsive"/></div>');
        $(".imgSrc[" + id + "]").append(imgSrc);
    }
}

function addItemToHtml(item,i) {
    var divElem = $("<div class='row'><div class='col-xs-12'><h4 class='text-center' style='color:#fff'>Referans "+(i+1)+"</h4><table class='table '><thead><tr><th><strong style='color:#fff'>Projenin Yeri</strong></th></tr></thead><tbody ><tr><td><span class='pull-left' style='color:#fff'>"+ item.projeYeri +"</span></td> </tr></tbody></table><table class='table '><thead><tr><th><strong style='color:#fff'>Uygulayıcı Bayi</strong></th></tr></thead><tbody ><tr><td><span class='pull-left' style='color:#fff'>"+ item.bayi +"</span></td> </tr></tbody></table><table class='table '><thead><tr><th><strong style='color:#fff'>Kullanılan Ürün</strong></th></tr></thead><tbody ><tr><td><span class='pull-left' style='color:#fff'>"+ item.kullanilanUrun +"</span></td></tr></tbody></table><table class='table '><thead><tr><th><strong style='color:#fff'>Açıklama</strong></th></tr></thead><tbody ><tr><td><span class='pull-left' style='color:#fff'>"+ item.aciklama +"</span></td></tr></tbody></table><table class='table '><thead><tr><th><strong style='color:#fff'>Resimler</strong></th></tr></thead><tbody class=''><tr><td><span class='pull-left' style='color:#fff'><div class='row'><div class='col-xs-12 tblResim"+item._id+"'></div></div><br> </span> </td></tr></tbody></table></div></div>");
    $(".referanslar").append(divElem);
    var imgArr = JSON.parse(item.fotograflar);
    for(var i = 0; i < imgArr.length; i++){
        var tr=$("<div class='col-xs-3'><img src='"+imgArr[i].link+"' style='max-height:100px;' class='img-responsive'></div>");
        $(".tblResim"+item._id).append(tr);
    }

}

function showAll(database) {
    database.transaction(function(tx) {
        tx.executeSql("SELECT*FROM referans", [], function(tx,
            results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var item = results.rows.item(i);
                addItemToHtml(item,i);
            }

        });
    });
}