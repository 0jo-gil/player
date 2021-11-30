let list_num = 0;

callData();

function callData(){
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/playlistItems", 
        dataType: "jsonp",
        async: false,
        data: {
            part: "snippet",
            key: "AIzaSyDQnEmKhqzQKaQwtZ6KHu9_szVRtmJjDgg",
            playlistId: "PLh1ZBMxUOR2EyhfqVDn2qWejw2st1Hm0V",
            maxResults: 5
        }
    })
    .success(function(data){
        let items= data.items;
        createList(items);
    })
    .error(function(err){
        console.log(err);
    })
};

function createList(items){
    
    for(let el of items){
        list_num++;
        
        let tit = el.snippet.title;
        let imgSrc = el.snippet.thumbnails.high.url;

        $(".music_tit").eq(list_num).children("h2").text(tit);
        $(".music_pic").eq(list_num).css({backgroundImage: `url(${imgSrc})`});
    };
};