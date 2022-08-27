const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8-PLAYER"

const heading = $("header h2");

const cdThumb = $(".cd-thumb");

const audio = $("#audio");

const playBtn = $(".btn-toggle-play");

const progress = $("#progress");

const prevBtn = $(".btn-prev")
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist")
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
        },
        {
            name:"Anh Met Roi",
            singer:"Freak D",
            path:"./assets/songs/Anh Met Roi.mp3",
            img:"./assets/img/anhmetroi.jpg"
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        htmls = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? "active":''}" data-index="${index}" >
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
        // Xử lí phóng to/ thu nhỏ CD
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
                const seekTime = event.target.value / 100 * audio.duration;
                audio.currentTime = seekTime;
            }
            // Next song
            nextBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                } else{
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // Prev song
            prevBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                } else{
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // On/off Random song
            randomBtn.onclick = function(){
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle("active",_this.isRandom);
                _this.setConfig("isRandom", _this.isRandom)
            }
            // Repeat song
            repeatBtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle("active",_this.isRepeat);
                _this.setConfig("isRepeat", _this.isRepeat);
            }
            // When audio ended
            audio.onended = function(){
                if(_this.isRepeat && _this.isRandom === false){
                    audio.play();
                } else
                    nextBtn.click();
            }
            // Click to playlist
            playlist.onclick = function(event){
                const songNode = event.target.closest(".song:not(.active)");

                if (songNode || event.target.closest(".option")){
                    if (songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        audio.play();
                        _this.render();
                    }
                }
                
            }
        
        
    },
    loadCurrentSong: function(){
        
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong : function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1 ;
        };
        this.loadCurrentSong();
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth", block: "end", inline: "nearest"
            })
        }, 200)
    },
    playRandomSong: function(){
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Load cấu hình
        this.loadConfig();
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        // Lắng nghe/ xử lí các sự kiện
        this.handleEvent();
        // Render giao diện
        this.render();
        // Tải thông tin bài hát đầu tiên vào UI chạy ứng dụng
        this.loadCurrentSong();
        
        randomBtn.classList.toggle("active",this.isRandom);
        repeatBtn.classList.toggle("active",this.isRepeat);
    },

}
app.start();
