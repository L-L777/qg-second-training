function selectMeeting(data){
    // console.log(data);
    let wantBox = document.querySelector('.want')
    let signBox=wantBox.querySelector('.sign')
    let sign=signBox.querySelectorAll('.s_t')
    let selectBox = wantBox.querySelector('.select_cont')
    selectBox.innerHTML = ''
    for(let i=0;i<sign.length;i++){
        sign[i].addEventListener('click',function(){
            sign[i].classList.toggle("active")
            let str = ''
            data.map((item) => {
                let choise=[]
                
                let theSign = item.sign.split(',')
                let mySign = signBox.querySelectorAll('.active')
                // console.log(mySign.length);
                if(mySign){
                    for (let j = 0; j < mySign.length; j++) {
                        choise.push(mySign[j].textContent)
                    }
                    // console.log(choise);
                    const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));

                    if (isSubset(theSign, choise)&&mySign.length!=0) {
                        let jsonData = JSON.stringify(item)
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
                             <div class="hidden">${jsonData}</div>
                        </div>`
                    }
                }
                
            })
            selectBox.innerHTML=str
            looking()
        })
    }
    
    
}
function looking() {
    let wantBox = document.querySelector('.want')
    let selectBox = wantBox.querySelector('.select_cont')
    let subject = selectBox.querySelectorAll('.subject')
    for (let i = 0; i < subject.length; i++) {
        subject[i].addEventListener('click', function () {
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
            let reasonBox = meetingBox.querySelector('.reason')
            reasonBox.style.display = 'block'
            if (data.reason) {
                reasonBox.querySelector('textarea').value = data.reason
            }
            else {
                reasonBox.querySelector('textarea').value = ''
            }
            let aQuestionBox = meetingBox.querySelector('.question')
            aQuestionBox.style.display = 'none'
            let answerBox = meetingBox.querySelector('.answer')
            answerBox.style.display = 'none'
            let btnBox = meetingBox.querySelector('.btn')
            btnBox.style.display = ''
            let changeBtn = btnBox.querySelector('.change')
            let keepBtn = btnBox.querySelector('.keep')
            keepBtn.style.display='none'
            changeBtn.style.display='inline-block'
            let submitBtn = btnBox.querySelector('.submit')
            submitBtn.style.display = 'none'
            let agreeBtn = btnBox.querySelector('.agree')
            let disagreeBtn = btnBox.querySelector('.disagree')
            if (data.status === 0) {
                agreeBtn.style.display = 'inline-block'
                disagreeBtn.style.display = 'inline-block'
            } else {
                agreeBtn.style.display = 'none'
                disagreeBtn.style.display = 'none'
            }
            let changeCont = meetingBox.querySelectorAll('.gai')
            for (let i = 0; i < changeCont.length; i++) {
                changeCont[i].classList.add('disabled')
            }
            changeBtn.addEventListener('click', function () {
                changeBtn.style.display = 'none'
                keepBtn.style.display = 'inline-block'
                let oldTheme = changeCont[0].value
                let oldContent = changeCont[1].value
                for (let i = 0; i < changeCont.length; i++) {
                    changeCont[i].classList.remove('disabled')
                }
                keepBtn.addEventListener('click', function () {
                    let newTheme = changeCont[0].value
                    let newContent = changeCont[1].value
                   
                    if (!newContent ) {
                        document.querySelector('.fail').innerHTML = "修改后会议内容不能为空"
                        document.querySelector('.fail').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.fail').innerHTML = ""
                            document.querySelector('.fail').style.display = 'none'

                        }, 2000)
                        return
                    }
                    if (!newTheme ) {
                        document.querySelector('.fail').innerHTML = "修改后会议主题不能为空"
                        document.querySelector('.fail').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.fail').innerHTML = ""
                            document.querySelector('.fail').style.display = 'none'

                        }, 2000)
                        return
                    }
                    if (newTheme !== oldTheme || newContent !== oldContent) {
                        let object = {
                            id: data.id,
                            username: data.username,
                            time: data.time,
                            theme: newTheme,
                            content: newContent
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
                                document.querySelector('.success').innerHTML = res
                                document.querySelector('.success').style.display = 'block'
                                setTimeout(() => {
                                    document.querySelector('.success').innerHTML = ""
                                    document.querySelector('.success').style.display = 'none'

                                }, 2000)

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

            agreeBtn.addEventListener('click', function () {
                let reasonBox = meetingBox.querySelector(".reason")
                let reason = reasonBox.querySelector('textarea').value
             
                if (!reason ) {
                    document.querySelector('.fail').innerHTML = "理由不能为空"
                    document.querySelector('.fail').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('.fail').innerHTML = ""
                        document.querySelector('.fail').style.display = 'none'

                    }, 2000)
                    return;
                }
                let object = {
                    id: data.id,
                    reason,
                    agree: 1,
                }
                fetch('http://localhost:3000/api/reason', {
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
                        data.status = 1;
                        subject[i].querySelector('.hidden').innerHTML = JSON.stringify(data)
                        reasonBox.querySelector('textarea').value = ''
                        disagreeBtn.style.display = 'none'
                        agreeBtn.style.display = 'none'
                        checkBtn.innerHTML = '已通过'
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                return;
            })
            disagreeBtn.addEventListener('click', function () {
                let reasonBox = meetingBox.querySelector(".reason")
                let reason = reasonBox.querySelector('textarea').value
                
                if (!reason ) {
                    document.querySelector('.fail').innerHTML = "理由不能为空"
                    document.querySelector('.fail').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('.fail').innerHTML = ""
                        document.querySelector('.fail').style.display = 'none'

                    }, 2000)
                    return;
                }
                let object = {
                    id: data.id,
                    reason,
                    agree: 0,
                }
                fetch('http://localhost:3000/api/reason', {
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
                        data.status = 1;
                        subject[i].querySelector('.hidden').innerHTML = JSON.stringify(data)
                        reasonBox.querySelector('textarea').value = ''
                        disagreeBtn.style.display = 'none'
                        agreeBtn.style.display = 'none'
                        checkBtn.innerHTML = '已驳回'
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                return;
            })
        })
    }
}