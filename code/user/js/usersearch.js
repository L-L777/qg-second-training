function searchData(oldData) {
    // console.log(data);
    let nav = document.querySelector('.nav')
    let search = nav.querySelector('.search')
    let inputBox = nav.querySelector('.search-box')
    let input = inputBox.querySelector('input')

    input.addEventListener('input', function () {
        // console.log(111);
        search.innerHTML = ''
        let key = input.value;
        if (key == '') {
            search.style.display = 'none'
            search.innerHTML = ''
            return
        }
        oldData.map((item) => {
            const themeMatchIndex = item.theme.indexOf(key);
            const usernameMatchIndex = item.username.indexOf(key);

            let all = JSON.stringify(item)
            let { username, theme } = item
            if (themeMatchIndex !== -1) {
                search.style.display = 'block'
                let regex = new RegExp("(.{0,3}" + key + ".{0,3})", "g");
                let matches = theme.match(regex)
                const parts = matches[0].split(key)
                let li = document.createElement('li')
                li.classList.add("result")
                let str = ''
                parts.forEach(function (part, index) {
                    if (index == parts.length - 1) { str += `<span>${part}</span><span class="nature">theme</span>` }
                    else { str += `<span>${part}</span><span class="key">${key}</span>` }
                });
                if (key == matches[0]) {
                    str += `<span class="hidden">${all}</span>`
                }
                str += `<span class="hidden">${all}</span>`
                li.innerHTML = str;
                search.appendChild(li)
            }
            if (usernameMatchIndex !== -1) {
                search.style.display = 'block'
                // let regex = new RegExp(key, 'g');
                let regex = new RegExp("(.{0,3}" + key + ".{0,3})", "g");
                let matches = username.match(regex)
                const parts = matches[0].split(key)
                // console.log(parts);
                let li = document.createElement('li')
                li.classList.add("result")
                let str = '';
                parts.forEach(function (part, index) {
                    if (index == parts.length - 1) { str += `<span>${part}</span><span class="nature">username</span>` }
                    else { str += `<span>${part}</span><span class="key">${key}</span>` }
                });
                if (key == matches[0]) {

                    str += `<span class="hidden">${all}</span>`
                }
                str += `<span class="hidden">${all}</span>`
                li.innerHTML = str;
                search.appendChild(li)
            }

        })
        let li = search.querySelectorAll('.result')
        for (let i = 0; i < li.length; i++) {
            li[i].addEventListener('click', function () {

                let hidden = li[i].querySelector('.hidden')
                // console.log(hidden.textContent);
                let data = JSON.parse(hidden.textContent)
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
            })
        }

    })
}