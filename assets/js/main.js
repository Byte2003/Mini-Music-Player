const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs:[
        {
            name:"Intentions",
            singer:"Justin Bieber",
            path:"./assets/songs/Intentions.mp3",
            img: "./assets/img/intentions.jpg"
        },
        {
            name:"Baby",
            singer:"Justin Bieber",
            path:"./assets/songs/Baby.webm",
            img: "./assets/img/baby.jpg"
        },
        {
            name:"Sorry",
            singer:"Justin Bieber",
            img: "./assets/img/sorry.jpg",
            path:"./assets/songs/Sorry.mp3",
        },
        {
            name:"See You Again",
            singer:"Wiz Khalifar, Charlie Puth",
            path:"./assets/songs/See You Again.mp3",
            img:"./assets/img/CharliePuthSeeYouAgain.png"
        },
        {
            name:"Honest",
            singer:"Justin Bieber",
            path:"./assets/songs/Honest.mp3",
            img:"./assets/img/honest.jpg"
        }
    ],
    render: function() {
        htmls = this.songs.map(song => {
            return `<div class="song">
                <div class="thumb" style="background-image:url('${song.img}')"></div>
            
                <div class="body">
                    <div class="title">${song.name}</div>
                    <div class="author">${song.singer}</div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    defineProperties: function(){
        Object.defineProperty(this, "currentSong", {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function(){
        // Xử lí phón to/ thu nhỏ CD
        const cd = $(".cd-thumb");
        const cdWidth = cd.offsetWidth;
        //  Rotating CD
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],
        {
            duration:10000,
            iterations:Infinity

        });
        cdThumbAnimate.pause();

        document.onscroll = function(){
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth + "px";
            cd.style.height =  newCdWidth + "px";
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // Xử lí khi click play/pause
        const _this= this;
        playBtn.onclick = function() {
            if (_this.isPlaying){
                audio.pause();
             } else {
                audio.play();
            }
            // When playing music
            audio.onplay = function(){
                _this.isPlaying = true;
                // Click to pause
                $(".btn-play").classList.add("hidden");
                $(".btn-pause").classList.remove("hidden");
                cdThumbAnimate.play();
            }
            // When pausing music
            audio.onpause = function(){
                _this.isPlaying = false;
                // Click to play
                $(".btn-pause").classList.add("hidden");
                $(".btn-play").classList.remove("hidden");
                cdThumbAnimate.pause();
            }
            // When progress of song has been changed
            audio.ontimeupdate = function(){
                if (audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
            // Seeking
            progress.onchange = function(event){
                const seekTime = event.target.value / 100 * audio.duration
                audio.currentTime = seekTime;
            }
        }
        
    },
    loadCurrentSong: function(){
        
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgrounfImage = `${this.currentSong.img}`;
        audio.src = this.currentSong.path;

    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Lắng nghe/ xử lí các sự kiện
        this.handleEvent();
        // Render giao diện
        this.render();
        // Tải thông tin bài hát đầu tiên vào UI chạy ứng dụng
        this.loadCurrentSong();
        
    },

}
app.start();
