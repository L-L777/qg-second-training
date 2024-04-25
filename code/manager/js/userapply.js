// 获取普通用户状态
function userAsk(){
    let applyBox = document.querySelector('.apply')
    let token = localStorage.getItem('token')
    fetch('http://localhost:3000/api/userstatus', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token, 
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); 

        }
        return response.json();
    }).then(data => {
        console.log(data);
        if (data.user.manager === 1) {
            renderApply(data.data)
        }

    })
}
// 渲染
function renderApply(data){
    let applyBox = document.querySelector('.apply')
    let renderBox=applyBox.querySelector('.apply-cont')
    let str=''
    data.map((item)=>{
        if(item.status===1){
            str +=`<div class="apply-person">
                            <div class="name">${item.username}</div>
                            <div class="btn">
                                <button class="agree">同意</button>
                                <button class="disagree">驳回</button>
                            </div>
                        </div>`
        }
    })
    renderBox.innerHTML=str;
    userToManager(renderBox)
}
// 同意或否决用户申请
function userToManager(renderBox){
    let users=renderBox.querySelectorAll('.apply-person')
    for(let i=0;i<users.length;i++){
        let btn=users[i].querySelector('.btn')
        let agree=btn.querySelector('.agree')
        let disagree=btn.querySelector('.disagree')
        let username=users[i].querySelector('.name').innerHTML
        // 同意
        agree.addEventListener('click', function(){
            let object={
username,
manager:1,
            }
            fetch('http://localhost:3000/api/userstatus', {
                method: 'POST',
                body: JSON.stringify(object),
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json' 
                }
            })
                .then(response => response.json())
                .then(data => {
                    btn.innerHTML = "已同意"

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
        })
        // 不同意
        disagree.addEventListener('click', function () {
            let object = {
                username,
                manager: 0,
            }
            fetch('http://localhost:3000/api/userstatus', {
                method: 'POST',
                body: JSON.stringify(object),
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    btn.innerHTML="已驳回"

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
        })
    }
}