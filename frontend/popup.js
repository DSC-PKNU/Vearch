const url = "http://192.168.50.179:3002";

window.onload = () =>{
  const videoSrcForm = document.getElementById("videoInputBar");
  const keywordSearchForm = document.getElementById("searchBar");

  videoSrcForm.addEventListener('submit', function(e){
    e.preventDefault();

    if(this.state.value === "create"){
      //parsing video ID
      const reg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      const videoID = reg.exec(this.link.value)[1];
      chrome.storage.local.set({'videoID' : videoID}, () => {
        console.log('videoID is ', videoID);
      });

      //check state and change tags
      changeTags(this.state.value, videoID); 
  
      //get Script from server and make list tags  
      (async() => {
        const scriptsJson = await getScriptData(videoID);

        //save script data in storage for searching keyword
        chrome.storage.local.set({'videoScript' : scriptsJson}, () => {
          console.log('script is ', scriptsJson);
        });

        //make script list tags
        makeScriptList(scriptsJson.scripts);
      })();
    }
    else {
      chrome.storage.local.clear();
      changeTags(this.state.value); 
      removeScriptList();
    }
  });

  //choose 'submit' or 'onChange'
  //do not need to submit because there's the script in storage
  keywordSearchForm.addEventListener('submit', function(e){
    e.preventDefault();
    const keyword = this.keyword.value;

    console.log("what you typed : ", keyword);

    //call the data from session storage
    chrome.storage.local.get(['videoScript'], function(result){
      const scriptArray = result.videoScript.scripts;

      (async() => {  
        //check keyword value
        //and make a new array to pass for makeScriptList function's parameter
        let newScriptArray = [];
        await scriptArray.forEach (el => {
          const time = el.time;
          const script = el.script;
          if(script.indexOf(keyword) != -1){
            newScriptArray.push(
              {
                time: time,
                script : script
              }, 
            )
          }
        })
        
        //make script list tags with new script array
        makeScriptList(newScriptArray);
      })();
    })
  });
}

//change tag's attributes depending on the state of button ('create' or 'delete')
const changeTags = (state, videoID = '') => {
  const input = document.getElementById("videoInput");
  const videoSrc_button = document.getElementById("videoSrc_button");
  const videoSrc = document.getElementById("videoSrc");
  const videoSrcText = videoSrc.getElementsByTagName("h4")[0];
  const video = document.getElementById("video");

  if(state === "create"){
    let src = `https://youtube.com/${videoID}`;
    let srcEmbed = `https://youtube.com/embed/${videoID}`;
    videoSrcText.innerText = src;
      
    input.style.display = "none";
    videoSrc_button.value = "delete";
    videoSrc_button.innerText = "delete";
    videoSrc.style.display = "inline";

    video.setAttribute('src', srcEmbed);
  }
  else{
    input.style.display = "inline-block";
    videoSrc_button.value = "create";
    videoSrc_button.innerText = "create";
    videoSrc.style.display = "none";
    input.value = "";
    video.removeAttribute('src');
  }
}

//fetch script json data
const getScriptData = async(videoID) => {
  const response = await fetch(url + '/link', {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({videoID: videoID})
  });
  const content = await response.json();
  return content;
}

//make script lists by json data
const makeScriptList = (data) => {
  removeScriptList();

  if(data === null) return new Error("There is no script!");
  let ul = document.getElementById("keywordLists");

  data.forEach( el => {
    let li = document.createElement("li");
    let timestamp = document.createElement("div");
    let keyword = document.createElement("div");
    timestamp.appendChild(document.createTextNode(el.time));
    timestamp.setAttribute("class", "timestamp");
    keyword.appendChild(document.createTextNode(el.script));
    keyword.setAttribute("class", "keyword");

    timestamp.addEventListener("click", () => {
      onTimeStampClickHandler(el.time);
    })

    li.appendChild(timestamp);
    li.appendChild(keyword);
    ul.appendChild(li);
  });
}

//remove script list tags
const removeScriptList = () => {
  let ul = document.getElementById("keywordLists");
  while(ul.firstChild){
    ul.removeChild(ul.firstChild);
  }
}

//play the video at the timestamp
const onTimeStampClickHandler = (timestamp) => {
  let time = timestamp.split(":");
  let seconds = Number(time[0] * 60) + Number(time[1]);
  
  chrome.storage.local.get(['videoID'], function(result){
    const videoID = result.videoID;
    const srcEmbed = `https://youtube.com/embed/${videoID}?start=${seconds}&autoplay=1`;

    const video = document.getElementById("video");
    video.setAttribute('src', srcEmbed);
  })
}