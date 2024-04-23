let token = localStorage.getItem('token')
window.addEventListener('DOMContentLoaded',function(){

    let nav = document.querySelector('.nav')//侧边栏
    // 渲染用户名
    fetch('http://localhost:3000/api/username', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token, // 将 token 添加到 Authorization 请求头中
            'Content-Type': 'application/json' // 可选，根据你的需求添加其他头部信息
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        // console.log(data);
        if (data.manager === 1) {
            let nameBox = document.querySelector('.logo-text')
            let username = nameBox.querySelector('.username')
            username.innerHTML = data.username
            draft(data.username)
        }

    })
    
    //切換功能
    let link=nav.querySelector('.menu-links')
    let t=link.querySelectorAll('.t')
    let meetingBox=document.querySelector('.r_meeting')
    let dealBox=document.querySelector('.deal')
    let wantBox=document.querySelector('.want')
    for(let i=0;i<t.length;i++){
        t[i].addEventListener('click',function(){
            for(let j=0;j<t.length;j++){
                t[j].classList.remove("active")
            }
            t[i].classList.add("active")
            meetingBox.style.display="none"
            dealBox.style.display="none"
            wantBox.style.display="none"
            if(t[i].classList.contains("meeting")){
                meetingBox.style.display = "flex"
            }
            if (t[i].classList.contains("question")) {
                dealBox.style.display = "flex"
            }
            if (t[i].classList.contains("select")) {
                wantBox.style.display = "flex"
            }
        })
    }

    // 管理会议纪要  筛选纪要
    manageMeeting()
    // 查看反馈
    dealQuestion()

    //轮播图
    let scrollBox=this.document.querySelector('.scrollpic')
    let prev=scrollBox.querySelector('.prev')
    let next=scrollBox.querySelector('.next')
    fetch('http://localhost:3000/api/scroll', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.user.manager === 1) {
            //    console.log(data.data);
               renderScroll(data.data)
            }
            else {
                alert('token验证失败')
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
// 渲染轮播图数据
        function renderScroll(data){
            let l;
            if(data.length>5){
                l=5;
            }else{
                l=data.length
            }
            let bottom=scrollBox.querySelector('.bottom')
            let picBox=scrollBox.querySelector('.pic')
            let themeBox=scrollBox.querySelector('.title')
            let str=titleStr=picStr=''
            for(let i=0;i<l;i++){
                let all=JSON.stringify(data[i])
                
                if(i==0){
                    titleStr += `<div class="theme ">
                            <p>${data[i].theme}</p>
                            <p class="hidden">${all}</p>
                        </div>`
                    str += '<span class="circle active"></span>'
                }else{
                    titleStr += `<div class="theme hidden">
                            <p>${data[i].theme}</p>
                            <p class="hidden">${all}</p>
                        </div>`
                    str += '<span class="circle"></span>'
                }
               
                picStr +=`<img src="${data[i].pic}" alt="">`
            }
            bottom.innerHTML=str;
            picBox.innerHTML=picStr
            themeBox.innerHTML=titleStr
            moveScroll(picBox,themeBox,bottom)
        }
        // 轮播图功能
    function moveScroll(picBox, themeBox, bottom){
        let img=picBox.querySelectorAll('img')
        let imgWidth=img[0].clientWidth
        let theme=themeBox.querySelectorAll('.theme')
        let circle=bottom.querySelectorAll('.circle')
        // console.log(moveWidth);
        let moveWidth
        let count=0;
        let timeId=setInterval(()=>{
            count++
            if (count > img.length - 1) {
                count = 0;
            }
            moveWidth = imgWidth * count
            for (let i = 0; i < img.length; i++) {
                img[i].style.transform = `translateX(-${moveWidth}px)`
                theme[i].classList.add('hidden')
                circle[i].classList.remove('active')
            }
            let index = Math.abs(count)
            theme[index].classList.remove('hidden')
            circle[index].classList.add('active')
        },5000)
     
        // 节流函数
        function throttle(func, delay) {
            let timer;
            return function () {
                if (!timer) {
                    func.apply(this, arguments);
                    timer = setTimeout(() => {
                        timer = null;
                    }, delay);
                }
            };
        }
        const throttledNext= throttle(function () {
            clearInterval(timeId);
            count++;
            if (count > img.length - 1) {
                count = 0;
            }
            moveWidth = imgWidth * count;
            for (let i = 0; i < img.length; i++) {
                img[i].style.transform = `translateX(-${moveWidth}px)`;
                theme[i].classList.add('hidden');
                circle[i].classList.remove('active');
            }
            let index = Math.abs(count);
            theme[index].classList.remove('hidden');
            circle[index].classList.add('active');
            timeId = setInterval(() => {
                count++;
                if (count > img.length - 1) {
                    count = 0;
                }
                moveWidth = imgWidth * count;
                for (let i = 0; i < img.length; i++) {
                    img[i].style.transform = `translateX(-${moveWidth}px)`;
                    theme[i].classList.add('hidden');
                    circle[i].classList.remove('active');
                }
                let index = Math.abs(count);
                theme[index].classList.remove('hidden');
                circle[index].classList.add('active');
            }, 5000);
        }, 2000);
        const throttledPrev = throttle(function () {
            clearInterval(timeId);
            count--
            if (count < 0) {
                count = img.length - 1;
            }
            moveWidth = imgWidth * count
            for (let i = 0; i < img.length; i++) {
                img[i].style.transform = `translateX(-${moveWidth}px)`
                theme[i].classList.add('hidden')
                circle[i].classList.remove('active')
            }
            let index = Math.abs(count)
            theme[index].classList.remove('hidden')
            circle[index].classList.add('active')
            timeId = setInterval(() => {
                count++
                if (count > img.length - 1) {
                    count = 0;
                }
                moveWidth = imgWidth * count
                for (let i = 0; i < img.length; i++) {
                    img[i].style.transform = `translateX(-${moveWidth}px)`
                    theme[i].classList.add('hidden')
                    circle[i].classList.remove('active')
                }
                let index = Math.abs(count)
                theme[index].classList.remove('hidden')
                circle[index].classList.add('active')
            }, 5000)
        }, 2000);
            next.addEventListener('click',throttledNext)
        prev.addEventListener('click', throttledPrev)
        for(let i=0;i<img.length;i++){
            circle[i].addEventListener('click',function(){
                clearInterval(timeId)
                count=i;
                for(let j=0;j<img.length;j++){
                    img[j].style.transform = `translateX(-${imgWidth*i}px)`
                    theme[j].classList.add('hidden')
                    circle[j].classList.remove('active')
                }
                theme[i].classList.remove('hidden')
                circle[i].classList.add('active')
                timeId = setInterval(() => {
                    count++
                    if (count > img.length - 1) {
                        count = 0;
                    }
                    moveWidth = imgWidth * count
                    for (let i = 0; i < img.length; i++) {
                        img[i].style.transform = `translateX(-${moveWidth}px)`
                        theme[i].classList.add('hidden')
                        circle[i].classList.remove('active')
                    }
                    let index = Math.abs(count)
                    theme[index].classList.remove('hidden')
                    circle[index].classList.add('active')
                }, 5000)
            })
            img[i].addEventListener('click',function(){
                let data = JSON.parse(theme[i].querySelector('.hidden').textContent)
                // console.log(data);
                let body = document.body
                body.style.overflow = 'hidden'
                let mask = document.querySelector('.mask')
                let meetingBox = mask.querySelector('.checkMeeting')
                mask.style.display = 'block'
                meetingBox.style.display = 'flex'
                let back = mask.querySelector('.x')
                back.addEventListener('click', function () {
                    mask.style.display = 'none'
                    meetingBox.style.display = 'none'
                    body.style.overflow = ''
                })
                // console.log(data);
                let title = meetingBox.querySelector('.title')
                title.querySelector('input').value = data.theme
                let name = meetingBox.querySelector('.name')
                name.innerHTML = `上传者：${data.username}`
                let time = meetingBox.querySelector('.time')
                time.innerHTML = `上传时间：${data.time}`
                let kind = meetingBox.querySelector('.kind')
                kind.innerHTML = `类型：${data.kind}`
                let sign = meetingBox.querySelector('.sign')
                sign.innerHTML = `标签：${data.sign}`
                let content = meetingBox.querySelector('.cont')
                content.querySelector('textarea').value = data.content
                let pic = meetingBox.querySelector('.pic')
                let img = pic.querySelector('img')
                img.src = data.pic
                let txt = meetingBox.querySelector('.txt')
                txt.innerHTML = data.txt
                meetingBox.querySelector('.btn').style.display='none'
            })
        }
        // 实时更新图片宽度
        function updateImgWidth() {
            imgWidth = img[0].clientWidth;
            for (let i = 0; i < img.length; i++) {
                moveWidth=imgWidth*count
                img[i].style.transform = `translateX(-${moveWidth}px)`
            }
        }

        window.addEventListener('resize', updateImgWidth); 

        }
    // 退出登录
    let outBtn = this.document.querySelector('.out')
    // console.log(outBtn);
    outBtn.addEventListener('click', function () {
        localStorage.removeItem('token')
        window.location.href = '/'

    })


    // 保留未提交的会议纪要
    function reserve(myname) {
        let submitBox = document.querySelector('.a-submit')
        let groupBox = submitBox.querySelector(".group")
        let themeBox = submitBox.querySelector(".theme")
        let contentBox = submitBox.querySelector(".cont")
        let pic = submitBox.querySelector(".pic")
        let picPreview = submitBox.querySelector(".see")
        let txtBox = submitBox.querySelector(".txt")
        let btnBox = submitBox.querySelector(".btn")
        let workCheckBox = document.getElementById('workCheckBox')
        let playCheckBox = document.getElementById('playCheckBox')
        let signBox = submitBox.querySelector(".sign")
        let sign = signBox.querySelectorAll('.bq')
        let arr = []
        for (let i = 0; i < sign.length; i++) {
            if (sign[i].classList.contains("active")) {
                arr.push(i);
            }
        }
        let object = {
            group: groupBox.value,
            theme: themeBox.value,
            content: contentBox.value,
            sign: arr,
            kind: { playCheckBox: playCheckBox.checked, workCheckBox: workCheckBox.checked },
            pic: pic.files[0],
            txt: submitBox.querySelector('.ttt').innerHTML
        }
        localStorage.setItem(myname, JSON.stringify(object))
    }
    // 渲染提交的会议纪要
    function draft(myname) {
        if (localStorage.getItem(myname)) {
            let all = JSON.parse(localStorage.getItem(myname));
            let submitBox = document.querySelector('.a-submit')
            let groupBox = submitBox.querySelector(".group")
            let themeBox = submitBox.querySelector(".theme")
            let contentBox = submitBox.querySelector(".cont")
            let pic = submitBox.querySelector(".pic")
            let picPreview = submitBox.querySelector(".see")
            let txtBox = submitBox.querySelector(".txt")
            let btnBox = submitBox.querySelector(".btn")
            let workCheckBox = document.getElementById('workCheckBox')
            let playCheckBox = document.getElementById('playCheckBox')
            let signBox = submitBox.querySelector(".sign")
            let sign = signBox.querySelectorAll('.bq')
            groupBox.value = all.group
            themeBox.value = all.theme
            contentBox.value = all.content
            let cb = all.sign
            if (cb) {
                for (let i = 0; i < cb.length; i++) {
                    sign[cb[i]].classList.add("active")
                }
            }
            let kind = all.kind
            workCheckBox.checked = kind.workCheckBox
            playCheckBox.checked = kind.playCheckBox
        }


    }
    // 草稿
    window.addEventListener('beforeunload', function (event) {
        let nameBox = document.querySelector('.logo-text')
        let myname = nameBox.querySelector('.username').textContent
        reserve(myname)
    });

   
// 图片懒加载
    function lazyLoad() {
        let lazyImages = document.querySelectorAll('.lazy-load');
        // console.log(111);
        lazyImages.forEach(image => {
            if (image.offsetTop < window.innerHeight + window.scrollY) {
                image.classList.remove('lazy-load');
                image.src = image.getAttribute('data-src');
                // console.log(111);
                
            }
        });
    }
this.setTimeout(()=>{
    lazyLoad();
},500)

    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    
})