const root = document.querySelector('#root');
let loader = document.createElement('div');
loader.setAttribute('class','loader')

function loadData(page=0, limit=10){ 
    if(page>0){
        fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
    .then(response=>response.json())
    .then(data=>{
    console.log(data)
        display(data)
        loader.remove()
    })   
    }
    else{fetch('https://picsum.photos/v2/list')
    .then(response=>response.json())
    .then(data=>{
    console.log(data)
        display(data)
    })   }
    }

loadData();

const display = (data) =>{
    let root = document.getElementById("root")
    data.map(({download_url, author, url })=>{
        let div = document.createElement("div")
        div.setAttribute('class','div')
        let container = document.createElement("div")
        container.setAttribute("class", "container")
        let img = document.createElement('img')
        img.src = download_url
        container.appendChild(img)
        let content = document.createElement('div')
        content.setAttribute("class", 'content')
        let p = document.createElement('p')
        p.setAttribute("class", 'author')
        p.innerText = `Photo by ${author}`
        let button = document.createElement('button')
        button.setAttribute('class','btn')
        button.addEventListener('click', ()=>{share(`${author}`, download_url)})
        button.innerHTML='Share'
        content.append(button)
        container.append(p,content)
        div.append(container)
        root.append(div)
    })
    
}


function share(author, dataUrl) {
  console.log("share")
  const file = new File(dataUrl, "picture.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator
          .share({
            files: [file],
            text: `Photo by ${author}`,
            title: `Photo | ${author}`,
          })
          .then(() => console.log("Share was successful."))
          .catch((error) => alert("Sharing failed", error));
      } else {
        try { //if location is http its change to https
          if (navigator.share === undefined) {
            if (window.location.protocol === "http:") {
              window.location.replace(
                window.location.href.replace(/^http:/, "https:")
              );
            }
          }
        } catch (error) {
          alert("Sharing failed", error);
        }
      }
  }


let pageCount =  1
// listen for scroll event and load more images if we reach the bottom of window
window.addEventListener('scroll',()=>{
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        pageCount++
        root.append(loader);
        loadData(pageCount, 10);
    }
})