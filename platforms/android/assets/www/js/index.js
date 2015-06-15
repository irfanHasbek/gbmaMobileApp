$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 * 1024);
    db.transaction(createTables, errorDB, successDB);
});

function errorDB(tx, err) {
    $.unblockUI();
    window.location.replace("webServisHatasi.html?hata=500");
}

function successLoad() {
    $.unblockUI();
    window.location.href = "anasayfa.html";
}
function successVersion() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 * 1024);
    var version = $("#versiyon").val();
    $.ajax({
        method:'GET',
        url:'https://www.google.com.tr',
        success:function(err,data){
            var status = false;
            if (version == "null") {
                $.blockUI({
                    message: "Veriler indiriliyor"
                });
                db.transaction(loadTables, errorDB, successLoad);

            } else {
                wsSyncGetData(config.webServiceHost + "versiyon/listele", function(results) {
                    if (results.state == false) {
                       window.location.replace("webServisHatasi.html?hata=404");;
                    } else {
                        if (results.data[0].mobilVersion != version) {
                            status = true;
                        }
                        if (status != true) {
                            window.location.href = "anasayfa.html";
                        } else {
                            alertify.confirm("Yeni güncelleme mevcut yapılmasını ister misiniz?", function() {
                                $.blockUI({
                                    message: "Güncellemeler indiriliyor"
                                });
                                db.transaction(dropTables, errorDB, successDrop);
                                db.transaction(loadTables, errorDB, successLoad);

                            }, function() {
                                window.location.href = "anasayfa.html";
                            });

                        }
                    }
                });
            }
        },
        error:function(err){
            if (version == 'null') {
                window.location.replace("webServisHatasi.html?hata=300");
            } else {
                window.location.href = "anasayfa.html";
            }
        }
    });
}

function successDrop() {}

function successDB() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 * 1024);
    db.transaction(function(tx) {
        tx.executeSql("SELECT*FROM versiyonKontrol", [], function(tx, result) {
            if (result.rows.length != 0) {
                $("#versiyon").val(result.rows.item(0).mobilVersion);
            } else {
                $("#versiyon").val("null");
            }

        });
    }, errorDB, successVersion);
}

function createTables(tx) {
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS yapilmis (_id REAL UNIQUE, baslik TEXT,dosyaLinki Text,aciklama Text,tarih Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS haberler (_id REAL UNIQUE, haberAdi TEXT,haberLinki Text,fotografLinki Text,aciklama Text,tarih Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS dokumanlar (_id REAL UNIQUE, dokumanTuru TEXT,icerik Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS urunler (_id REAL UNIQUE, urunGrubu TEXT,icerik Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS fiyat (_id REAL UNIQUE, urunFiyatGrubu TEXT,icerik Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS referans (_id REAL UNIQUE, projeYeri TEXT,bayi Text,  kullanilanUrun Text,aciklama Text,fotograflar Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS egitim_takvimi (_id REAL UNIQUE, tarih TEXT,yer Text,  konu Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS bayiler (_id REAL UNIQUE, isimSoyisim Text,bolgeAdi Text,email Text,telefon1 Text,telefon2 Text,gsm Text,fax Text,adres Text)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS versiyonKontrol (mobilVersion TEXT)", []
    );
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS videoKanalID (videoSaglayici Text,videoLinki TEXT)", []
    );

}

function wsSyncGetData(url, callback) {
     $.ajax({
        type: "POST",
        dataType: "json",
        Accept: "application/json; charset=utf-8",
        data: {
            firmaKodu: config.firmaKodu
        },
        url: encodeURI(url),
        async: false,
        success:function(data){
            callback(data);
        },
         error:function(err){
            window.location.replace("webServisHatasi.html?hata=404");
         }
    });
}

function loadTables(tx) {
    wsSyncGetData(config.webServiceHost + "haberler/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var obj = {
                    _id: (i + 1),
                    haberAdi: result.data[i].haberAdi,
                    haberLinki: result.data[i].haberLinki,
                    fotografLinki: result.data[i].fotografLinki,
                    aciklama: result.data[i].aciklama,
                    tarih: result.data[i].tarih
                };
                addToHaberlerTable(tx, obj);
            }
        }
    });
    //yapılmış eğitimler
    wsSyncGetData(config.webServiceHost + "yapilmis_egitimler/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var obj = {
                    _id: (i + 1),
                    baslik: result.data[i].baslik,
                    dosyaLinki: result.data[i].dosyaLinki,
                    aciklama: result.data[i].aciklama,
                    tarih: result.data[i].tarih
                };
                addToYapilmisTable(tx, obj);
            }
        }
    });
    //dokumanlar
    wsSyncGetData(config.webServiceHost + "dokuman_tanimi/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var icerik = JSON.stringify(result.data[i].icerik);
                var _id = (i + 1);
                var dokumanTuru = result.data[i].dokumanTuru;
                var obj = {
                    _id: _id,
                    dokumanTuru: dokumanTuru,
                    icerik: icerik
                };
                addToDokumanlarTable(tx, obj);
            }
        }
    });
    //urunler
    wsSyncGetData(config.webServiceHost + "urun_tanimi/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var icerik = JSON.stringify(result.data[i].icerik);
                var _id = (i + 1);
                var urunGrubu = result.data[i].urunGrubu;
                var obj = {
                    _id: _id,
                    urunGrubu: urunGrubu,
                    icerik: icerik
                };
                addToUrunlerTable(tx, obj);
            }
        }

    });
    //fiyatlar
    wsSyncGetData(config.webServiceHost + "fiyat_tanimi/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var icerik = JSON.stringify(result.data[i].icerik);
                var _id = (i + 1);
                var urunFiyatGrubu = result.data[i].urunFiyatGrubu;
                var obj = {
                    _id: _id,
                    urunFiyatGrubu: urunFiyatGrubu,
                    icerik: icerik
                };
                addToFiyatTable(tx, obj);
            }
        }
    });
    //referanslar
    wsSyncGetData(config.webServiceHost + "referanslar/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var obj = {
                    fotograflar: JSON.stringify(result.data[i].fotograflar),
                    _id: (i + 1),
                    bayi: result.data[i].bayi,
                    kullanilanUrun: result.data[i].kullanilanUrun,
                    aciklama: result.data[i].aciklama,
                    projeYeri: result.data[i].projeYeri
                };

                addToReferansTable(tx, obj);
            }
        }
    });
    //egitim takvimi
    wsSyncGetData(config.webServiceHost + "egitim_takvimi/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var obj = {
                    _id: (i + 1),
                    tarih: result.data[i].tarih,
                    yer: result.data[i].yer,
                    konu: result.data[i].konu
                };
                addToEgitimTable(tx, obj);
            }
        }
    });
    //bayiler
    wsSyncGetData(config.webServiceHost + "iletisim/listele", function(result) {
        if (result.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            for (var i = 0; i < result.data.length; i++) {
                var obj = {
                    _id: (i + 1),
                    isimSoyisim: result.data[i].isimSoyisim,
                    bolgeAdi: result.data[i].bolgeAdi,
                    email: result.data[i].email,
                    telefon1: result.data[i].telefon1,
                    telefon2: result.data[i].telefon2,
                    gsm: result.data[i].gsm,
                    fax: result.data[i].fax,
                    adres: result.data[i].adres
                };
                addToBayilerTable(tx, obj);
            }
        }
    });
    wsSyncGetData(config.webServiceHost + "versiyon/listele", function(results) {
        if (results.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {
            var obj = {
                mobilVersion: results.data[0].mobilVersion
            };
            addToVersiyonTable(tx, obj);
        }
    });
    wsSyncGetData(config.webServiceHost + "video_tanimi/ara", function(results) {
        if (results.state == false) {
           window.location.replace("webServisHatasi.html?hata=404");;
        } else {

            var obj = {
                videoSaglayici: results.data[0].videoSaglayici,
                videoLinki: results.data[0].videoLinki
            };
            addToVideoTable(tx, obj);
        }

    });
}

function addToUrunlerTable(tx, task) {
    tx.executeSql(
        'INSERT INTO urunler (_id, urunGrubu,icerik) values (?,?,?)', [
            task["_id"], task["urunGrubu"], task["icerik"]
        ]);

}

function addToYapilmisTable(tx, task) {
    tx.executeSql(
        'INSERT INTO yapilmis (_id, baslik,dosyaLinki,aciklama,tarih) values (?, ?,?,?,?)', [
            task["_id"], task["baslik"], task["dosyaLinki"], task[
                "aciklama"], task["tarih"]
        ]);

}

function addToVersiyonTable(tx, task) {
    tx.executeSql(
        'INSERT INTO versiyonKontrol (mobilVersion) values (?)', [
            task["mobilVersion"]
        ]);

}

function addToVideoTable(tx, task) {
    tx.executeSql(
        'INSERT INTO videoKanalID (videoSaglayici,videoLinki) values (?,?)', [
            task["videoSaglayici"], task["videoLinki"]
        ]);

}

function addToDokumanlarTable(tx, task) {
    tx.executeSql(
        'INSERT INTO dokumanlar (_id, dokumanTuru,icerik) values (?,?,?)', [
            task["_id"], task["dokumanTuru"], task["icerik"]
        ]);

}

function addToHaberlerTable(tx, task) {
    tx.executeSql(
        'INSERT INTO haberler (_id, haberAdi,haberLinki,fotografLinki,aciklama,tarih) values (?,?,?,?,?,?)', [
            task["_id"], task["haberAdi"], task["haberLinki"], task["fotografLinki"],
            task["aciklama"], task["tarih"]
        ]);

}

function addToFiyatTable(tx, task) {
    tx.executeSql(
        'INSERT INTO fiyat (_id, urunFiyatGrubu,icerik) values (?, ?,?)', [
            task["_id"], task["urunFiyatGrubu"], task["icerik"]
        ]);

}

function addToReferansTable(tx, task) {
    tx.executeSql(
        'INSERT INTO referans (_id, projeYeri,bayi,kullanilanUrun,aciklama,fotograflar) values (?, ?,?,?,?,?)', [
            task["_id"], task["projeYeri"], task["bayi"], task["kullanilanUrun"], task["aciklama"], task["fotograflar"]
        ]);

}

function addToEgitimTable(tx, task) {
    tx.executeSql(
        'INSERT INTO egitim_takvimi (_id, tarih,yer,konu) values (?, ?,?,?)', [
            task["_id"], task["tarih"], task["yer"], task["konu"]
        ]);

}

function addToBayilerTable(tx, task) {
    tx.executeSql(
        'INSERT INTO bayiler (_id,isimSoyisim,bolgeAdi,email,telefon1,telefon2,gsm,fax,adres) values (?,?,?,?,?,?,?,?,?)', [
            task["_id"], task["isimSoyisim"], task["bolgeAdi"], task["email"], task["telefon1"], task["telefon2"], task["gsm"], task["fax"], task["adres"]
        ]);

}

function dropTables(tx) {
    tx.executeSql("DELETE FROM haberler");
    tx.executeSql("DELETE FROM yapilmis");
    tx.executeSql("DELETE FROM urunler");
    tx.executeSql("DELETE FROM referans");
    tx.executeSql("DELETE FROM egitim_takvimi");
    tx.executeSql("DELETE FROM fiyat");
    tx.executeSql("DELETE FROM versiyonKontrol");
    tx.executeSql("DELETE FROM dokumanlar");
    tx.executeSql("DELETE FROM bayiler");
    tx.executeSql("DELETE FROM videoKanalID");
}