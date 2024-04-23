// 个人中心
function personalCenter(){
    let token = localStorage.getItem('token')
    let personBox = document.querySelector('.person-mes')
    let passwordBox=personBox.querySelector('.password')
    let changeBtn=passwordBox.querySelector('.change')
    
    changeBtn.addEventListener('click',function(){
        let nameBox = document.querySelector('.logo-text')
        let myname = nameBox.querySelector('.username').textContent 
        // console.log(myname);
        let newPassword=prompt('请输入您要修改的密码：')
        if(newPassword){
            let object={
                username:myname,
                password:newPassword,
            }
            fetch('http://localhost:3000/api/password', {
                method: 'POST',
                body: JSON.stringify(object),
                headers: {
                    'Authorization': 'Bearer ' + token, 
                    'Content-Type': 'application/json' 
                },
            })
                .then(response => response.json())
                .then(data => {
                    // console.log(data);

                    document.querySelector('.success').innerHTML = data
                    document.querySelector('.success').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('.success').innerHTML = ""
                        document.querySelector('.success').style.display = 'none'

                    }, 2000)
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    })
    fetch('http://localhost:3000/api/person', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if(data.user.manager===0){
                renderPersonalData(data.data)
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function renderPersonalData(data){
    let token = localStorage.getItem('token')
    let personBox = document.querySelector('.person-mes')
    let contentBox=personBox.querySelector('.cont')
    let agreeStr ='<div class="agree">已通过：</div>'
    let disagreeStr = '<div class="disagree">被退回：</div>'
    let waitStr ='<div class="wait">待审核：</div>'
    let status=0;
    data.map((item)=>{
        let all=JSON.stringify(item)
        let reason
        if (item.reason&&item.reason.length > 30) {
            reason=item.reason.substring(0,30)+'...'
        }else{
            reason=item.reason
        }
        if(item.status===0){
            
            waitStr +=`<div class="cont-wait">
                                <div class="title">标题：${item.theme}</div>
                                <div class="time">时间：${item.time.substring(0,10)}</div>
                                
                                    <div class="see"><button>查看</button></div>
                                
                                <div class="hidden">${all}</div>
                            </div>`
        }
        if(item.agree===1){
            status=1
            agreeStr +=`<div class="cont-agree">
                                <div class="title">标题：${item.theme}</div>
                                <div class="time">时间：${item.time.substring(0, 10)}</div>
                                <div class="reason">
                                    <div class="text">通过理由：</div>
                                    <p>${reason}</p>
                                </div>
                                <div class="see"><button>查看</button></div>
                                <div class="hidden">${all}</div>
                            </div>`
        }
        if (item.agree === 0) {
            status=1
            disagreeStr += `<div class="cont-disagree">
                                <div class="title">标题：${item.theme}</div>
                                <div class="time">时间：${item.time.substring(0, 10)}</div>
                                <div class="reason">
                                    <div class="text">退回理由：</div>
                                    <p>${reason}</p>
                                </div>
                                <div class="see"><button>查看</button></div>
                                <div class="hidden">${all}</div>
                            </div>`
        }
    })
    if(status===0){
        agreeStr = '<div class="agree">已通过：无</div>'
        disagreeStr = '<div class="disagree">被退回：无</div>'
    }
    contentBox.innerHTML=agreeStr+disagreeStr+waitStr
    seeing()
}
function seeing(){
    let token = localStorage.getItem('token')
    let personBox = document.querySelector('.person-mes')
    let contentBox = personBox.querySelector('.cont')
    let seeBtn=contentBox.querySelectorAll('button')
    for(let i=0;i<seeBtn.length;i++){
        seeBtn[i].addEventListener('click', function () {
            let see=seeBtn[i].parentNode
            let hidden=see.nextElementSibling
            let data=JSON.parse(hidden.innerHTML)
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
            let btnBox = meetingBox.querySelector('.btn')
            btnBox.style.display = 'none'
            let aQuestionBox = meetingBox.querySelector('.question')
            let aAnswerBox = meetingBox.querySelector('.answer')
            aQuestionBox.style.display = 'none'
            aAnswerBox.style.display = 'none'
            let reasonBox=meetingBox.querySelector('.reason')
            if(data.reason){
                reasonBox.style.display = 'block'
                reasonBox.querySelector('textarea').value = data.reason
                if(data.agree===1){
                    reasonBox.querySelector('.til').innerHTML = "通过理由"
                }
                if(data.agree===0){
                    reasonBox.querySelector('.til').innerHTML = "退回理由"
                }
            }else{
                reasonBox.style.display = 'none'
                reasonBox.querySelector('textarea').value=''
            }
           
        })
    }
    
}