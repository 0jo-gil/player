
const frame = document.querySelector("#frame");
const music_info_ul = document.querySelector(".music_info_list>ul");
const music_info_list = document.querySelectorAll(".music_info_list>ul>li");
const music_list_btn = document.querySelectorAll(".music_list>li");

const about_btn = document.querySelector(".about_btn>a");

const first_play_btn = document.querySelector(".first_play_btn");
const wave = document.querySelector(".wave>a");
const scroll_motion = document.querySelector(".scroll_motion");


let len = music_info_list.length;

let isScroll = false;
let num = 0;
let cursor_num = 0;
let isIn = false;

let timer;



// youtube iframe 
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

window.onload = ()=>{   
    music_info_list[0].classList.add("active");
};

//mouse wheel 이벤트
frame.addEventListener("mousewheel", (e)=>{
    let wheel = e.deltaY;
    let wid = music_info_list[0].clientWidth;

    if(isScroll) return;

    if(wheel > 0 ){
        if(num == 0) return;
        wheelUp(wid);
        isScroll = true;
    } else {
        wheelDown(wid);
        isScroll = true;
    };
});

// 휠 올렸을시 이벤트
function wheelUp(wid){
    if(num == len -1){
        num = len - 1
    } else {
        num++;
        player.playVideoAt(num -1);
    };
    
    removeList(music_info_list);

    for(let i=0; i<num; i++){
        music_info_list[i].classList.add("off");
    };

    for(let el of music_list_btn){
        el.classList.remove("active");
    };

    if(num < len -1){
        music_info_list[num+1].classList.add("before");
    };

    music_list_btn[num].classList.add("active");
    music_info_list[num].classList.add("active");
    music_info_ul.style.transform = `translateX(${-wid * num}px)`;

    setTimeout(()=>{
        isScroll = false;
    }, 1000);
};

// 휠 내렸을 시 이벤트
function wheelDown(wid){
    if(num == 0){
        num = 0;
    } else {
        num--;
        player.playVideoAt(num-1);
    };

    removeList(music_info_list);
    
    for(let i=0; i<num; i++){
        music_info_list[i].classList.add("off");
    };
    music_info_list[num].classList.add("active");
    if(num >= 0){
        music_info_list[num+1].classList.add("before");
    };  
    for(let el of music_list_btn){
        el.classList.remove("active");
    };

    music_info_ul.style.transform = `translateX(${-wid * num}px)`;
    music_list_btn[num].classList.add("active");

    if(num == 0){
        player.stopVideo();
        scroll_motion.classList.remove("active");
    };
    setTimeout(()=>{
        isScroll = false;
    }, 1000);
};

// 클래스 제거 함수
function removeList(ele){
    for(let el of ele){
        el.classList.remove("active");
        el.classList.remove("off");
        el.classList.remove("before");
    };
};


// about 버튼 클릭시 이벤트
about_btn.addEventListener("click", (e)=>{

    const about_div = document.createElement("div");
    about_div.classList.add("about_mo");

    let xhr = new XMLHttpRequest();
    callAbout(xhr, about_div);
    e.preventDefault();
});

//about page ajax 호출
function callAbout(xhr, el){
    xhr.open('GET', 'data/about.html', true);
    xhr.send();
    xhr.onload=(data)=>{
        if(xhr.status == 200){
            console.log("ajax success");

            let d = data.currentTarget.response;
            document.querySelector("body").append(el);
            document.querySelector(".about_mo").innerHTML = d;

            setTimeout(()=>{
                document.querySelector(".about_mo").classList.add("active");
            }, 300);

        } else {
            console.log("ajax error");
        }
    }
}

//동적 생성 된 about page 닫기 버튼 이벤트 연결
document.addEventListener('click',function(e){
    if(e.target.className == 'about_close_btn'){
        document.querySelector(".about_mo").classList.remove("active");
    }
});

// list 버튼 클릭 이벤트
for(let el of music_list_btn){
    el.addEventListener("click", ()=>{
        let index = el.getAttribute("data-index");
        index = parseInt(index);
        let wid = music_info_list[0].clientWidth;

        num = index;

        removeList(music_info_list);

        for(let i=0; i<index; i++){
            music_info_list[i].classList.add("off");
        };

        music_info_list[index].classList.add("active");
        if(index < music_info_list.length -1){
            music_info_list[index+1].classList.add("before");
        };

        for(let i=0; i<music_list_btn.length; i++){
            music_list_btn[i].classList.remove("active");
        };

        el.classList.add("active");
        music_info_ul.style.transform = `translateX(${-wid * index}px)`;

        if(index == 0){
            player.stopVideo();
            scroll_motion.classList.remove("active");
        };
        player.playVideoAt(index -1);
    });
};


//mouse 커서 이벤트

window.addEventListener("mouseover", ()=>{
    createCursor();
});

window.addEventListener("mousemove", (e)=>{
    let posX = e.clientX;
    let posY = e.clientY;

    moveCursor(posX, posY);
});

document.querySelector("html").addEventListener("mouseleave", ()=>{
    cursorRemove();
});

// 마우스 커서 생성
function createCursor(){
    const cursor = document.createElement("div");
    cursor.classList.add("cursor_bg");

    if(!isIn){
        document.querySelector("body").prepend(cursor);
        isIn = true;
        setTimeout(()=>{
            document.querySelector(".cursor_bg").classList.add("active");
        }, 100);
    };
};

//  마우스 커서 위치 함수
function moveCursor(x, y){
    if(isIn){
        document.querySelector(".cursor_bg").style.top = `${y}px`;
        document.querySelector(".cursor_bg").style.left = `${x}px`;
    };
};

// 커서 제거 함수
function cursorRemove(){
    document.querySelector(".cursor_bg").classList.remove("active");
    setTimeout(()=>{
        isIn = false;
        document.querySelector(".cursor_bg").remove();
    }, 500);
};

// 파형 클릭시
wave.addEventListener('click', (e)=>{
    e.preventDefault();
});

// 초기 Play 버튼 클릭시
first_play_btn.addEventListener("click", (e)=>{
    e.preventDefault();
    let wid = music_info_list[0].clientWidth;
    playBtnClick(wid);
});

function playBtnClick(wid){
    num = 1;

    removeList(music_info_list);

    for(let i=0; i<num; i++){
        music_info_list[i].classList.add("off");
    };

    scroll_motion.classList.add("active");
    music_list_btn[0].classList.remove("active");
    music_list_btn[1].classList.add("active");
    music_info_list[2].classList.add("before");
    music_info_list[num].classList.add("active");
    music_info_ul.style.transform = `translateX(${-wid * num}px)`;
};



// youtube iframe 설정 함수
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        playerVars: {
            listType: "playlist",
            list: "PLh1ZBMxUOR2EyhfqVDn2qWejw2st1Hm0V"
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {

    first_play_btn.addEventListener("click", (e)=>{
        e.preventDefault();
        player.playVideo();
    });

};

function onPlayerStateChange(event) {
    if(event.data == -1){
        wave.classList.remove("on");
        wave.classList.add("pause");
        clearInterval(timer);
    }
    if(event.data == 0){
        // console.log("h1");
        clearInterval(timer);
    }
    if(event.data == 1){
        timer = setInterval(function(){
            let total_time = player.getDuration();
            let current_time = player.getCurrentTime();

            if(current_time >= total_time){
                player.stopVideo();
                clearInterval(timer);
            };
        }, 100);

        wave.classList.remove("pause");
        wave.classList.add("on");
        wave.addEventListener("click", (e)=>{
            e.preventDefault();
            player.pauseVideo();
        })
    };
    if(event.data == 2){
        wave.classList.remove("on");
        wave.classList.add("pause");
        wave.addEventListener("click", (e)=>{
            e.preventDefault();
            player.playVideo();
        });

        clearInterval(timer);
    };
};


function playYoutube() {
    player.playVideo();
};
function pauseYoutube() {
    player.pauseVideo();
};

function stopVideo() {
    player.stopVideo();
};

function indexVideo(){
    player.playVideoAt();
};

function nextVideo(){
    player.nextVideo();
};

function prevVideo(){
    player.previousVideo();
};
