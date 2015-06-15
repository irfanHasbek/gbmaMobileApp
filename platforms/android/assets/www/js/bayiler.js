$(document).ready(function()
{
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
    tumBayiler(db);
    $("#btnGonder").click(function()
    {
        if (navigator.onLine)
        {
            var data = {};
            var ad = $("#inpAd").val();
            var mesaj=$("#txtMesaj").val();
            data.firmaKodu="659865265";
            data.email = $("#inpEmail").val();
            data.konu = $("#inpKonu").val();
            data.aciklama ="isim : "+ad+"  mesaj : "+mesaj;
            console.log(data);
            $.ajax(
            {
                type: "POST",
                dataType: "json",
                Accept: "application/json; charset=utf-8",
                data: data,
                url: config.webServiceHost+"diger/mailgonder",
                success: function(resp)
                {
                    alertify.success("mesaj başarıyla gönderildi");
                },
                error: function(err)
                {
                    alertify.error("hata!!! mesaj gönderilemedi");
                }
            });
            $("input[type='text']").val("");
            $("textarea").val("");
        }
        else
        {
            alertify.error("Lütfen internet bağlantınızı kontrol ediniz!!");
        }
    });
});


function tumBayiler(database)
{
    database.transaction(function(tx)
    {
        tx.executeSql("SELECT*FROM bayiler", [], function(tx,
            results)
        {

            var len = results.rows.length;
            for (var i = 0; i < len; i++)
            {
                var item = results.rows.item(i);
                var listData = $('<p><strong>' + item.isimSoyisim + '</strong></p><p><span>Bölge Adi: ' + item.bolgeAdi + '</span></p><p><span >-E-mail: ' + item.email +'</span></p><p><span>-Telefon1 :' + item.telefon1 + '</span></p><p><span>-Telefon2 :' + item.telefon2 + '</span></p><p><span>-GSM :' + item.gsm + '</span></p><p><span>-Fax :' + item.fax +'</span></p><p><span>-adres :' + item.adres + '</span></p><br>');
                $(".bayiler").append(listData);
            }

        });
    });
}