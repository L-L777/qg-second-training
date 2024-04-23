
// 查看会议纪要
function checkMeeting(token) {
    let lookBox = document.querySelector('.look')
    let renderBox = lookBox.querySelector('.cont-deal')
    fetch('http://localhost:3000/api/meeting', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token, 
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.user.manager===0){
                renderData(data.data)
               
                // 为搜索功能通过数据
                searchData(data.data)
            }
            else{
                alert('token验证失败')
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
       
}
function renderData(data){
    let lookBox = document.querySelector('.look')
    let renderBox = lookBox.querySelector('.cont-deal')
    let bottom=lookBox.querySelector('.bottom')
    let prev=bottom.querySelector('.prevpage')
    let next=bottom.querySelector('.nextpage')
    let page=bottom.querySelector('.page')
    let a=0,b=9;
    let count=1
    let str=''
    let draw=data.slice(a,b)
    let sum = Math.ceil(data.length / 9)
    page.innerHTML=`${count}/${sum}`
    // console.log(draw);
    draw.map((item)=>{
        let a=JSON.stringify(item)
        str +=` <div class="subject">
                            <div class="title">
                                <span class="text">标题：</span>
                                <span class="m_t">${item.theme}</span>
                            </div>
                            <div class="name">
                                <span class="text">上传者：</span>
                                <span class="m_t">${item.username}</span>
                            </div>
                            <div class="time">
                                <span class="text">上传时间：</span>
                                <span class="m_t">${item.time.substring(0, 10) }</span>
                            </div>
                            <div class="hidden">${a}</div>
                        </div>`
    })
    renderBox.innerHTML=str
    lookMeeting(renderBox)
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
    let prevClick = throttle(function () {
        if (a<=0) {
            return;
        }
        count--;
        a -= 9;
        b -= 9;
        let str = ''
        draw = data.slice(a, b)
        page.innerHTML = `${count}/${sum}`
        // console.log(draw);
        draw.map((item) => {
            let a = JSON.stringify(item)
            str += ` <div class="subject">
                            <div class="title">
                                <span class="text">标题：</span>
                                <span class="m_t">${item.theme}</span>
                            </div>
                            <div class="name">
                                <span class="text">上传者：</span>
                                <span class="m_t">${item.username}</span>
                            </div>
                            <div class="time">
                                <span class="text">上传时间：</span>
                                <span class="m_t">${item.time.substring(0, 10)}</span>
                            </div>
                            <div class="hidden">${a}</div>
                        </div>`
        })
        renderBox.innerHTML = str
        lookMeeting(renderBox)
    }, 2000)
   let nextClick=throttle(function(){
    if(b>=data.length){
        return;
    }
    count++;
    a+=9;
    b+=9;
    let str=''
    if(b>data.length){
        draw = data.slice(a,data.length)
    }else{
        draw = data.slice(a, b)
    }
       page.innerHTML = `${count}/${sum}`
       // console.log(draw);
       draw.map((item) => {
           let a = JSON.stringify(item)
           str += ` <div class="subject">
                            <div class="title">
                                <span class="text">标题：</span>
                                <span class="m_t">${item.theme}</span>
                            </div>
                            <div class="name">
                                <span class="text">上传者：</span>
                                <span class="m_t">${item.username}</span>
                            </div>
                            <div class="time">
                                <span class="text">上传时间：</span>
                                <span class="m_t">${item.time.substring(0, 10)}</span>
                            </div>
                            <div class="hidden">${a}</div>
                        </div>`
       })
       renderBox.innerHTML = str
       lookMeeting(renderBox)
   },2000)
    prev.addEventListener('click', prevClick)
   next.addEventListener('click',nextClick)
}
function lookMeeting(renderBox){
    let token=localStorage.getItem('token')
    let subject = renderBox.querySelectorAll('.subject');

    if (subject) {
        for (let i = 0; i < subject.length; i++) {
            subject[i].addEventListener('click', function () {
                let body=document.body
                body.style.overflow='hidden'
                let mask = document.querySelector('.mask')
                let meetingBox = mask.querySelector('.checkMeeting')
                mask.style.display = 'block'
                meetingBox.style.display = 'flex'
                let back=mask.querySelector('.x')
                back.addEventListener('click',function(){
                    mask.style.display='none'
                    meetingBox.style.display='none'
                    body.style.overflow = ''
                })
                let hidden = subject[i].querySelector('.hidden')
                let data = JSON.parse(hidden.innerHTML)
                // console.log(data);
                let  title=meetingBox.querySelector('.title')
                title.querySelector('input').value=data.theme
                let name=meetingBox.querySelector('.name')
                name.innerHTML =`上传者：${data.username}`
                let  time=meetingBox.querySelector('.time')
                time.innerHTML=`上传时间：${data.time}`
                let kind=meetingBox.querySelector('.kind')
                kind.innerHTML=`类型：${data.kind}`
                let sign=meetingBox.querySelector('.sign')
                sign.innerHTML=`标签：${data.sign}`
                let content=meetingBox.querySelector('.cont')
                content.querySelector('textarea').value=data.content
                let pic=meetingBox.querySelector('.pic')
                let img=pic.querySelector('img')
                img.src=data.pic
                let txt=meetingBox.querySelector('.txt')
                txt.innerHTML=data.txt
                let aQuestionBox=meetingBox.querySelector('.question')
                let aAnswerBox=meetingBox.querySelector('.answer')
                aQuestionBox.style.display='block'
                aQuestionBox.querySelector('textarea').value = ''
                aAnswerBox.style.display='none'
                let reasonBox = meetingBox.querySelector('.reason')
                reasonBox.style.display = 'none'
                let nameBox=document.querySelector('.logo-text')
                let myname=nameBox.querySelector('.username').textContent
                // console.log(myname);
                let btnBox=meetingBox.querySelector('.btn')
                btnBox.style.display = ''
                let changeBtn=btnBox.querySelector('.change')
                let keepBtn=btnBox.querySelector('.keep')
                keepBtn.style.display='none'
                let questionBtn=btnBox.querySelector('.ques')
                if(myname===data.username&&data.status===0){
                    changeBtn.style.display='inline-block'
                }else{
                    changeBtn.style.display = 'none'
                }
                let changeCont = meetingBox.querySelectorAll('.gai')
                for (let i = 0; i < changeCont.length; i++) {
                    changeCont[i].classList.add('disabled')
                }
                changeBtn.addEventListener('click',function(){
                    changeBtn.style.display='none'
                    keepBtn.style.display='inline-block'
                    let oldTheme=changeCont[0].value
                    let oldContent=changeCont[1].value
                  for(let i=0;i<changeCont.length;i++){
                    changeCont[i].classList.remove('disabled')
                  }
                  keepBtn.addEventListener('click',function(){
                    let newTheme=changeCont[0].value
                    let newContent=changeCont[1].value
                    
                    if(!newContent){
                        document.querySelector('.fail').innerHTML = "修改后会议内容不能为空"
                        document.querySelector('.fail').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.fail').innerHTML = ""
                            document.querySelector('.fail').style.display = 'none'
                            
                        }, 2000)
                        
                        return
                    }
                      if (!newTheme) {
                          document.querySelector('.fail').innerHTML = "修改后会议主题不能为空"
                          document.querySelector('.fail').style.display = 'block'
                          setTimeout(() => {
                              document.querySelector('.fail').innerHTML = ""
                              document.querySelector('.fail').style.display = 'none'

                          }, 2000)
                   
                          return
                      }
                    if(newTheme!==oldTheme||newContent!==oldContent){
                        let object={
                            id:data.id,
                            username:data.username,
                            time:data.time,
                            theme:newTheme,
                            content:newContent
                        }
                        // console.log(object);
                        back.addEventListener('click', function () {
                            body.style.overflow = ''
                        })
                        fetch('http://localhost:3000/api/change', {
                            method: 'POST',
                            body: JSON.stringify(object),
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                        })
                            .then(response => response.json())
                            .then(res => {
                                let flag = false
                                if (!flag) {
                                    alert(`${res}`)
                                    flag = true
                                }
                                changeCont[0].value = newTheme;
                                changeCont[1].value = newContent;
                                data.theme = newTheme
                                data.content = newContent
                                subject[i].querySelector('.hidden').innerHTML = JSON.stringify(data)
                                let titleBox = subject[i].querySelector('.title')
                                titleBox.querySelector('.m_t').textContent = newTheme
                                oldContent = newContent
                                oldTheme = newTheme
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                           return; 
                    }
                  })
                })
                questionBtn.addEventListener('click', function () {
                    let questionBox = meetingBox.querySelector('.question')
                    let question = questionBox.querySelector('textarea').value
                   
                    if (!question) {
                        document.querySelector('.fail').innerHTML = "疑问内容不能为空"
                        document.querySelector('.fail').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.fail').innerHTML = ""
                            document.querySelector('.fail').style.display = 'none'

                        }, 2000)

                        return;
                    }
                    data.theme=changeCont[0].value
                    data.content=changeCont[1].value
                    let object={
                        ...data,
                        question:question,
                    }
                    console.log(object);
                    fetch('http://localhost:3000/api/ask', {
                        method: 'POST',
                        body: JSON.stringify(object),
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => response.json())
                        .then(res => {
                            // console.log(data);
                            
                            document.querySelector('.success').innerHTML = res
                            document.querySelector('.success').style.display = 'block'
                            setTimeout(() => {
                                document.querySelector('.success').innerHTML = ""
                                document.querySelector('.success').style.display = 'none'

                            }, 2000)

                            questionBox.querySelector('textarea').value=''
                            
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
return;
                })
            })
        }
    }
}