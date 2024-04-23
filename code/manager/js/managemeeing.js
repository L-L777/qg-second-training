//获取时间
function getCurrentDate() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
// 管理会议纪要
function manageMeeting() {
    let token = localStorage.getItem('token')
    fetch('http://localhost:3000/api/meeting', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if(data.user.manager===1){
                renderMeetingData(data.data)
                selectMeeting(data.data)
                // 搜索功能提供数据
                searchData(data.data)
                // 导出纪要
                exportData(data.data)
            }
            else{
                alert('token验证失败')
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// 渲染 
function renderMeetingData(data) {
    let meetingBox = document.querySelector('.r_meeting')
    let mainBox = meetingBox.querySelector('.main-cont')
    let ul = mainBox.querySelector('ul')
    // console.log(data);
    let str = ''
    data.map((item) => {
        let all=JSON.stringify(item)
        let time = item.time.substring(0, 10)
        if(item.status===0){
            str += `<li class="theli">
                                    <div class="cont">
                                        <div class="image">
                                            <img src="" data-src="${item.pic}" class="lazy-load" alt="">
                                        </div>
                                        <div class="message">
                                            <div class="title">
                                                <span class="text">标题：</span>
                                                <span class="m_t">${item.theme}</span>
                                            </div>
                                            <div class="person">
                                                <span class="text">上传者：</span>
                                                <span class="m_t">${item.username}</span>
                                            </div>
                                            <div class="time">
                                                <span class="text">上传时间:</span>
                                                <span class="m_t">${time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        <button class="check">查看</button>
                                        <button class="delete">删除</button>
                                    </div>
                                    <div class="hidden">${all}</div>
                                </li>`
        }
        if(item.status===1&&item.agree===1){
            str += `<li class="theli">
                                    <div class="cont">
                                        <div class="image">
                                            <img src="" data-src="${item.pic}" class="lazy-load" alt="">
                                        </div>
                                        <div class="message">
                                            <div class="title">
                                                <span class="text">标题：</span>
                                                <span class="m_t">${item.theme}</span>
                                            </div>
                                            <div class="person">
                                                <span class="text">上传者：</span>
                                                <span class="m_t">${item.username}</span>
                                            </div>
                                            <div class="time">
                                                <span class="text">上传时间:</span>
                                                <span class="m_t">${time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        <button class="check">已通过</button>
                                        <button class="delete">删除</button>
                                    </div>
                                    <div class="hidden">${all}</div>
                                </li>`
        }
        if (item.status === 1 && item.agree === 0){
            str += `<li class="theli">
                                    <div class="cont">
                                        <div class="image">
                                            <img src="" data-src="${item.pic}" class="lazy-load" alt="">
                                        </div>
                                        <div class="message">
                                            <div class="title">
                                                <span class="text">标题：</span>
                                                <span class="m_t">${item.theme}</span>
                                            </div>
                                            <div class="person">
                                                <span class="text">上传者：</span>
                                                <span class="m_t">${item.username}</span>
                                            </div>
                                            <div class="time">
                                                <span class="text">上传时间:</span>
                                                <span class="m_t">${time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        <button class="check">已驳回</button>
                                        <button class="delete">删除</button>
                                    </div>
                                    <div class="hidden">${all}</div>
                                </li>`
        }
       
    })
    ul.innerHTML=str
    checkingBox()
    deleteData()
    addMeeting()
}
// 增加
function addMeeting(){
    let token = localStorage.getItem('token')
    let meetings = document.querySelector('.r_meeting')
    let addBox=meetings.querySelector('.add')
    let addBtn=addBox.querySelector('.addBtn')
    let mainBox = meetings.querySelector('.main-cont')
    let ul = mainBox.querySelector('ul')
    let subject = ul.querySelectorAll('.theli')
    addBtn.addEventListener('click',function(){
        let body = document.body
        body.style.overflow = 'hidden'
        let mask = document.querySelector('.mask')
        let meetingBox = mask.querySelector('.checkMeeting')
        mask.style.display = 'block'
        let submitBox=mask.querySelector('.a-submit')
        submitBox.style.display='flex'
        let back = mask.querySelector('.x')
        back.addEventListener('click', function () {
            mask.style.display = 'none'
            submitBox.style.display = 'none'
            body.style.overflow = ''
        })
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
        for (let i = 0; i < sign.length; i++) {
            sign[i].addEventListener('click', function () {
                if (sign[i].classList.contains("active")) {
                    sign[i].classList.remove("active")
                } else {
                    let active = signBox.querySelectorAll('.active')
                    if (active.length >= 3) {
                        alert("所选标签不能超过三个")
                    } else {
                        sign[i].classList.add("active")
                    }

                }
                // sign[i].classList.toggle("active")
            })
        }
        pic.addEventListener('change', function () {
            const file = pic.files[0];

            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                picPreview.innerHTML = '';
                picPreview.appendChild(img);
            }
            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = '';
            }
        })
        let content
        let t = submitBox.querySelector('.ttt')
        txtBox.addEventListener('change', function (e) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event) => {
                content = event.target.result;

                t.innerHTML = content
            };

        })
        function empty() {
            groupBox.value = ''
            contentBox.value = ''
            themeBox.value = ''
            pic.value = ''
            txtBox.value = ''
            t.innerHTML = ''
            picPreview.innerHTML = ''
            workCheckBox.checked = false
            playCheckBox.checked = false
            for (let i = 0; i < sign.length; i++) {
                sign[i].classList.remove("active")
            }
        }


        // 重置
        btnBox.querySelector(".reset").addEventListener('click', function () {
            empty()
        })
        //    提交
        btnBox.querySelector('.sub').addEventListener('click', function () {
            if (!groupBox.value) {
                alert('组别不能为空')
                return
            }
            if (!themeBox.value) {
                alert('会议主题不能为空')
                return
            }
            if (!contentBox.value) {
                alert('会议内容不能为空')
                return
            }
            if (!pic.value) {
                alert('会议图片不能为空')
                return
            }
            if (!txtBox.value) {
                alert('个人纪要不能为空')
                return
            }
            if (playCheckBox.checked === false && workCheckBox.checked === false) {
                alert('类型不能为空')
                return
            }
            let active = signBox.querySelectorAll('.active')
            if (active.length === 0) {
                alert('必须选一个标签')
                return
            }

            let time = getCurrentDate()
            let kind
            if (playCheckBox.checked) {
                kind = document.querySelector('label[for="playCheckBox"]').textContent;
            } else {
                kind = document.querySelector('label[for="workCheckBox"]').textContent;
            }

            setTimeout(() => {
                const formData = new FormData();
                let content = submitBox.querySelector('.ttt').innerHTML
                formData.append('txt', content);
                formData.append('group', groupBox.value);
                formData.append('time', time);
                formData.append('theme', themeBox.value);
                formData.append('content', contentBox.value);
                formData.append('pic', pic.files[0]);

                formData.append('kind', kind);
                let sign = []
                for (let i = 0; i < active.length; i++) {
                    sign.push(active[i].textContent)
                }
                formData.append('sign', sign)
                // for (let pair of formData.entries()) {
                //     console.log(pair[0] + ', ' + pair[1]);
                // }
                fetch('http://localhost:3000/api/meeting', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': 'Bearer ' + token, // 将 token 添加到 Authorization 请求头中
                        // 'Content-Type': 'application/json' // 可选，根据你的需求添加其他头部信息
                    },
                })
                    .then(response => response.text())
                    .then(data => {
                        console.log(data);
                        document.querySelector('.success').innerHTML = data
                        document.querySelector('.success').style.display = 'block'
                        setTimeout(() => {
                            document.querySelector('.success').innerHTML = ""
                            document.querySelector('.success').style.display = 'none'

                        }, 2000)
                        empty();
                        mask.style.display = 'none'
                        submitBox.style.display = 'none'
                        body.style.overflow = ''
                        location.reload();
                        
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }, 100)

        })
    })
    checkingBox()
    deleteData()
}
function checkingBox(){
    let token = localStorage.getItem('token')
    let meetings = document.querySelector('.r_meeting')
    let mainBox = meetings.querySelector('.main-cont')
    let ul = mainBox.querySelector('ul')
    let subject=ul.querySelectorAll('.theli')
    if(subject){
        for(let i=0;i<subject.length;i++){
           
                let btnBox=subject[i].querySelector('.btn')
                let checkBtn=btnBox.querySelector('.check')
                let deleteBtn=btnBox.querySelector('.delete')
                checkBtn.addEventListener('click',function(){
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

                    let reasonBox=meetingBox.querySelector('.reason')
                    reasonBox.style.display='block'
                    if(data.reason){
                        reasonBox.querySelector('textarea').value=data.reason
                    }
                    else{
                        reasonBox.querySelector('textarea').value = ''
                    }
                    let aQuestionBox=meetingBox.querySelector('.question')
                    aQuestionBox.style.display='none'
                    let answerBox=meetingBox.querySelector('.answer')
                    answerBox.style.display='none'
                    let btnBox = meetingBox.querySelector('.btn')
                    btnBox.style.display=''
                    let changeBtn = btnBox.querySelector('.change')
                    let keepBtn = btnBox.querySelector('.keep')
                    keepBtn.style.display='none'
                    changeBtn.style.display='inline-block'
                    let submitBtn = btnBox.querySelector('.submit')
                    submitBtn.style.display='none'
                    let agreeBtn = btnBox.querySelector('.agree')
                    let disagreeBtn = btnBox.querySelector('.disagree')
                    if(data.status===0){
                        agreeBtn.style.display ='inline-block'
                        disagreeBtn.style.display ='inline-block'
                    }else{
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
                           
                            if (!newContent) {
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
                                        let flag=false
                                        if(!flag){
                                            alert(`${res}`)
                                            flag=true
                                        }
                                        
                                        changeCont[0].value = newTheme;
                                        changeCont[1].value = newContent;
                                        data.theme=newTheme
                                        data.content=newContent
                                        subject[i].querySelector('.hidden').innerHTML = JSON.stringify(data)
                                        let titleBox=subject[i].querySelector('.title')
                                        titleBox.querySelector('.m_t').textContent=newTheme
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
                     
                        if (!reason) {
                            document.querySelector('.fail').innerHTML = "理由不能为空"
                            document.querySelector('.fail').style.display = 'block'
                            setTimeout(() => {
                                document.querySelector('.fail').innerHTML = ""
                                document.querySelector('.fail').style.display = 'none'

                            }, 2000)
                            return;
                        }
                        let object={
                            id:data.id,
                            reason,
                            agree:1,
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
                                reasonBox.querySelector('textarea').value=''
                                disagreeBtn.style.display = 'none'
                                agreeBtn.style.display = 'none'
                                checkBtn.innerHTML='已通过'
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    
                        return;
                    })
                    disagreeBtn.addEventListener('click', function () {
                        let reasonBox = meetingBox.querySelector(".reason")
                        let reason = reasonBox.querySelector('textarea').value
                       
                        if (!reason) {
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
                                data.status=1;
                                subject[i].querySelector('.hidden').innerHTML=JSON.stringify(data)
                                reasonBox.querySelector('textarea').value = ''
                                disagreeBtn.style.display='none'
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
}
// 删除
function deleteData(){
    let token = localStorage.getItem('token')
    let meetings = document.querySelector('.r_meeting')
    let mainBox = meetings.querySelector('.main-cont')
    let ul = mainBox.querySelector('ul')
    let subject = ul.querySelectorAll('.theli')
    for(let i=0;i<subject.length;i++){
        let btnBox = subject[i].querySelector('.btn')
        let checkBtn = btnBox.querySelector('.check')
        let deleteBtn = btnBox.querySelector('.delete')
        deleteBtn.addEventListener('click',function(){
          
            let hidden = subject[i].querySelector('.hidden')
            let data = JSON.parse(hidden.innerHTML)
            let object={
                id:data.id
            }
            fetch('http://localhost:3000/api/delete', {
                method: 'post',
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
                    ul.removeChild(subject[i])
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        })
    }

}

// 导出纪要
function exportData(data){
    let meetingBox=document.querySelector('.r_meeting')
    let exportBox=meetingBox.querySelector('.export')
    let btn=exportBox.querySelector('button')
    let input=exportBox.querySelector('input')
    btn.addEventListener('click',function(){
        let sum = parseInt(input.value)
        if (typeof sum !== 'number' || isNaN(sum)){
            input.value=''
            document.querySelector('.fail').innerHTML = "请输入数字"
            document.querySelector('.fail').style.display = 'block'
            setTimeout(() => {
                document.querySelector('.fail').innerHTML = ""
                document.querySelector('.fail').style.display = 'none'

            }, 2000)
            return;
        }
        if(sum>data.length){
            input.value = ''
            document.querySelector('.fail').innerHTML = `当前纪要仅有${data.length}条`
            document.querySelector('.fail').style.display = 'block'
            setTimeout(() => {
                document.querySelector('.fail').innerHTML = ""
                document.querySelector('.fail').style.display = 'none'

            }, 2000)
            return;
        }
        // 创建 Excel 表格内容
        let excelContent = 'username\tgroup\ttheme\tcontent\tkind\tsign\ttime\n'; // 表头
        for(let i=0;i<sum;i++){
            let isoTime = new Date(data[i].time).toISOString(); // 将时间转换为 ISO 8601 格式
            // let txtContent = data[i].txt.replace(/\t/g, ' '); // 将 txt 字段中的制表符替换为空格
            let content = data[i].content.replace(/\n/g, '\\n'); // 将 content 字段中的换行符替换为 \n
            excelContent += `${data[i].username}\t${data[i].group}\t${data[i].theme}\t"${content}"\t${data[i].kind}\t${data[i].sign}\t${isoTime}\n`;
        }
        // data.forEach(meeting => {
           

        // });
        // 创建 Blob 对象
        let blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let url = URL.createObjectURL(blob);

        // 创建一个隐藏的下载链接并点击下载
        let a = document.createElement('a');
        a.href = url;
        a.download = 'meetings.xlsx';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
input.value=''

    })
}