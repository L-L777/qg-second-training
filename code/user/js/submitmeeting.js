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
function submitMeeting(token) {
    
    // 上传纪要
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
            
            t.innerHTML=content
        };

    })
    // 将所有提交框变为空
    function empty() {
        groupBox.value = ''
        contentBox.value = ''
        themeBox.value = ''
        pic.value = ''
        txtBox.value = ''
        t.innerHTML=''
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
        // 非空判断
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
    
        setTimeout(()=>{
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
                   

                    document.querySelector('.success').innerHTML = data
                    document.querySelector('.success').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('.success').innerHTML = ""
                        document.querySelector('.success').style.display = 'none'

                    }, 2000)
                    empty();
                    location.reload();
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },100)
       
    })

}
