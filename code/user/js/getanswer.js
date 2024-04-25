// 疑问反馈
function getAnswer(){
    let token = localStorage.getItem('token')
    let responseBox = document.querySelector('.response')
    fetch('http://localhost:3000/api/deal', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.user.manager === 0) {
                renderAnswerData(data.data,data.user.username)
            }
            else {
                alert('token验证失败')
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// 渲染反馈数据
function renderAnswerData(data,username){
    let responseBox = document.querySelector('.response')
    let renderBox=responseBox.querySelector('.res')
    renderBox.innerHTML=''
    let str=''
    data.map((item)=>{
        let all=JSON.stringify(item)
        if(item.askusername===username&&item.answer){
            str +=`<div class="subject">
                            对${item.theme}会议纪要的反馈
                            <div class="hidden">${all}</div>
                        </div>`
        }
    })
    renderBox.innerHTML=str;
    let subject=renderBox.querySelectorAll('.subject')
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
            let btnBox = meetingBox.querySelector('.btn')
           btnBox.style.display='none'
            let aQuestionBox = meetingBox.querySelector('.question')
            let aAnswerBox = meetingBox.querySelector('.answer')
            let reasonBox = meetingBox.querySelector('.reason')
            reasonBox.style.display = 'none'
            aQuestionBox.style.display = 'block'
            aQuestionBox.querySelector('textarea').value=data.question
            aAnswerBox.style.display = 'block'
            aAnswerBox.querySelector('textarea').value=data.answer
        })
    }
    
}