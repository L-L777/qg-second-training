function dealQuestion(){
    let dealBox = document.querySelector('.deal')
    let token = localStorage.getItem('token')
    let dealingBox=dealBox.querySelector('.cont-deal')
    fetch('http://localhost:3000/api/deal', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data.data);
            if (data.user.manager === 1) {
                renderDealingData(data.data)
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// 渲染
function renderDealingData(data){
    let dealBox = document.querySelector('.deal')
    let dealingBox = dealBox.querySelector('.cont-deal')
    let str=''
    data.map((item)=>{
        let all=JSON.stringify(item)
        let time=item.time.substring(0,10)
    if(item.status===1){
        str += `<div class="subject">
        <div class="status ">已反馈</div>
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
                                <span class="m_t">${time}</span>
                            </div>
                            <div class="hidden">${all}</div>
                        </div>`
    }else{
        str += `<div class="subject">
        <div class="status dont">未反馈</div>
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
                                <span class="m_t">${time}</span>
                            </div>
                            <div class="hidden">${all}</div>
                        </div>`
    }
        
    })
    dealingBox.innerHTML=str
    checkingQuestion()
}
function checkingQuestion(){
    let dealBox = document.querySelector('.deal')
    let token = localStorage.getItem('token')
    let dealingBox = dealBox.querySelector('.cont-deal')
    let subject=dealingBox.querySelectorAll('.subject')
    for(let i=0;i<subject.length;i++){
        subject[i].addEventListener('click',function(){
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
            let hidden = subject[i].querySelector('.hidden')
            let data = JSON.parse(hidden.innerHTML)
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
            let reasonBox = meetingBox.querySelector('.reason')
            reasonBox.style.display = 'none'
            let aQuestionBox = meetingBox.querySelector('.question')
            aQuestionBox.style.display = 'block'
            aQuestionBox.querySelector('.til').innerHTML =`用户${data.askusername}的疑问`
            aQuestionBox.querySelector('textarea').value =data.question
            let answerBox = meetingBox.querySelector('.answer')
            answerBox.style.display = 'block'

            if(data.answer){
                answerBox.querySelector('textarea').value=data.answer
            }
            else{
                answerBox.querySelector('textarea').value = ''
            }

            let btnBox = meetingBox.querySelector('.btn')
            btnBox.style.display = ''
            let changeBtn = btnBox.querySelector('.change')
            let keepBtn = btnBox.querySelector('.keep')
            let submitBtn = btnBox.querySelector('.submit')
            submitBtn.style.display = 'block'
            let agreeBtn = btnBox.querySelector('.agree')
            let disagreeBtn = btnBox.querySelector('.disagree')
            changeBtn.style.display = 'none'
            keepBtn.style.display = 'none'
            agreeBtn.style.display = 'none'
            disagreeBtn.style.display = 'none'
            submitBtn.addEventListener('click',function(){
                let answer=answerBox.querySelector('textarea').value
                
                if(!answer){
                    document.querySelector('.fail').innerHTML = "反馈不能为空"
                    document.querySelector('.fail').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('.fail').innerHTML = ""
                        document.querySelector('.fail').style.display = 'none'

                    }, 2000)
                    return;
                }
                if(answer===data.answer){
                    return;
                }
                let object = {
                    id: data.id,
                    answer,
                }
                fetch('http://localhost:3000/api/deal', {
                    method: 'POST',
                    body: JSON.stringify(object),
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => response.json())
                    .then(res => {
                        document.querySelector('.success').innerHTML = res
                        document.querySelector('.success').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.success').innerHTML = ""
                            document.querySelector('.success').style.display = 'none'

                        }, 2000)
                        
                        data.answer=answer
                        subject[i].querySelector('.hidden').innerHTML = JSON.stringify(data)
                        subject[i].querySelector('.status').classList.remove("dont")
                        subject[i].querySelector('.status').innerHTML='已反馈'
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                return;
            })
        })
    }
}