function pListFirst(kanalID) {
    var playListURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + kanalID + '&maxResults=10&key=AIzaSyCLnucP2S61sNUj0xf96AtS_cJ6FW3xnnQ';
   getVideos(playListURL);
}

function pListNext(pageToken, kanalID) {
    var playListUrlNext = 'https://www.googleapis.com/youtube/v3/search?part=snippet&pageToken='+ pageToken + '&channelId=' + kanalID + '&maxResults=10&order=date&key=AIzaSyCLnucP2S61sNUj0xf96AtS_cJ6FW3xnnQ';
         getVideos(playListUrlNext);
}

function getVideos(playListURL) {
    $.ajax({
        Type:"GET",
        url:playListURL,
        datatype:"json",
        success :function(data){
            if (data.nextPageToken) {
            $("#inpNextToken").val(data.nextPageToken);
            }
            for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            var feedTitle = item.snippet.title;
            var description = item.snippet.description;
            var videoID = item.id.videoId;
            var videoItem = $(
                '<div class="col-md-12 no-padding lib-item" data-category="view"><div class="lib-panel"><div class="row box-shadow"><div class="col-md-6"> <div class="videowrapper"><iframe class="gddf"  src="https://www.youtube.com/embed/' +
                videoID +
                '?modestbranding=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe></div></div><div class="col-md-6"><div class="lib-row lib-header">' +
                feedTitle +
                '</div><div class="lib-row lib-desc">' +
                description +
                '</div></div></div></div></div>');
            $(".videos").append(videoItem);
        }
        },
        error:function(err){
            window.location.replace("webServisHatasi.html?hata=404");
        }
    });
}

$(document).ready(function() {
    var db = openDatabase('solimpex', '1', 'solimpex db', 2 * 1024 *
        1024);
    db.transaction(function(tx) {
        tx.executeSql("SELECT*FROM videoKanalID Where videoSaglayici='youtube'", [], function(tx,
            results) {

            var item = results.rows.item(0);
            $("#video").val(item.videoLinki);


        });
    }, errorVideo, successVideo);
});

function successVideo() {
    var kanalID = $("#video").val();
    if (navigator.onLine) {
        pListFirst(kanalID);
        $("#btnDahaFazla").click(function() {
            var token = $("#inpNextToken").val();
            if(token){
            pListNext(token, kanalID);
            }
        });
    } else {
        window.location.href="webServisHatasi.html?hata=500";
    }
}

function errorVideo() {}