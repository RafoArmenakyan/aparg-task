const searchForm = document.querySelector('form')
const searchInp = document.querySelector('.searchInp')
const imagesDiv = document.querySelector('.imagesDiv')
const errorTxt = document.querySelector('.errorTxt')
const busketsNameDivs = document.querySelector('.busketsNameDivs')
const busketsImagesDiv = document.querySelector('.busketsimagesDiv')



const allowDrop = ev => {
    ev.preventDefault();
  }
  
const drag = ev => {
    ev.dataTransfer.setData("d&d", ev.currentTarget.id);
    ev.dataTransfer.setData("category", ev.currentTarget.dataset.category)
}
  
const drop = ev => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("d&d");
    let category = ev.dataTransfer.getData("category")
    if(category.toLowerCase() === ev.currentTarget.dataset.category.toLowerCase()){
        ev.currentTarget.appendChild(document.getElementById(data));
        let pushImages = Array.from(document.querySelectorAll(`.busketsNameDivs div[data-category="${category}"] img`))
        let pushHereImages = document.querySelector(`.busketsimagesDiv div[data-category="${category}"]`)
        pushHereImages.querySelectorAll('img').forEach(img => img.remove())
        pushImages.forEach(img => {
            pushHereImages.innerHTML += `<img src="${img.src}" class="images">`
        })
    }
    setTimeout(() => {
        if(!imagesDiv.innerHTML){
            alert('You Win !!!!')
            busketsImagesDiv.innerHTML = "", busketsNameDivs.innerHTML ="", imagesDiv.innerHTML =""
            return
        }
    }, 500)
}


const errorFunc = error => {
    imagesDiv.innerHTML = ""
    busketsNameDivs.innerHTML = ""
    errorTxt.innerText = `${error}`
}


const createBusketsNameDivs = name => {
    if(errorTxt.innerText.length>0){
        return
    }

    busketsNameDivs.innerHTML += 
    `
        <div class="busketsLook" data-category="${name}" ondragover="allowDrop(event)" ondrop="drop(event)" >
            <p data-category="${name}">${name}</p>
        </div>
    `
    
    busketsImagesDiv.innerHTML += 
    `   
        <div class="draggableDiv" data-category="${name}">
            <p>${name.toUpperCase()} Pictures</p>
        </div> 
    `
    busketsNameDivs.addEventListener('click', (e) => {
        const dataCategory = e.target.dataset.category
        document.querySelectorAll(`.busketsimagesDiv div`).forEach(el => el.style.display = "none")
        document.querySelector(`.busketsimagesDiv div[data-category="${dataCategory}"]`).style.display = "block"
    })
}

const showImages = (serverId, id, secret, dataAttr) => {
    errorTxt.innerText = ""
    imagesDiv.innerHTML += `<img src="https://live.staticflickr.com/${serverId}/${id}_${secret}.jpg" class="images"  draggable="true" ondragstart="drag(event)" id="${id}" data-category="${dataAttr}">`
}

const getImgAttr = (imgArr, dataAttr) => {
    if(imgArr.length<1){
       errorFunc('There Is No Images For This Name !!!')
       return
    }
    imgArr.forEach(element => {
        showImages(element.server, element.id, element.secret, dataAttr)
    });
}

const bringImages = (imgInfo) => {
    if(!imgInfo || !imgInfo.replace(/\s/g, '').length){
        errorFunc('Fill In Category, Which You Want To Search For !!!')
        return
    }
    imagesDiv.innerHTML = ""
    busketsNameDivs.innerHTML = ""
    imgInfo.split(' ').forEach(info => {
        fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=d2c342ebbda0b1d53e18310802461765&gallery_id=6065-72157617483228192&per_page=5&tags=${info}&page=1&format=json&nojsoncallback=1`)
        .then(response => response.json())
        .then(galleria => getImgAttr(galleria.photos?.photo,info))
        .then(() => createBusketsNameDivs(info))
    })
}


searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const searchInpVal = searchInp.value
    bringImages(searchInpVal)
    searchForm.reset()
})


