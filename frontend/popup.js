const url = "http://192.168.50.179:3001";

window.onload = () =>{
  const blankVideo =  document.getElementById("blankVideo");
  const logo =  document.getElementById("logo");
  const search_icon =  document.getElementById("search_icon");
  const search_input =  document.getElementById("search_input");

  //create video and script
  blankVideo.addEventListener('click', function(){
    const pasteText = document.querySelector("#output");
    pasteText.focus();
    document.execCommand('paste');
    let videoLink = pasteText.value;

    //should check if the pasted text is valid
    //parsing video ID
    const reg = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const videoID = reg.exec(videoLink)[1];

    chrome.storage.local.set({'videoID' : videoID}, () => {
      console.log('videoID is ', videoID);
    });

    //check state and change tags
    changeTags("create", videoID); 

    //get Script from server and make list tags  
    (async() => {
      const scriptsJson = await getScriptData(videoLink);

      //save script data in storage for searching keyword
      chrome.storage.local.set({'videoScript' : scriptsJson}, () => {
        console.log('script is ', scriptsJson);
      });

      //make script list tags
      makeScriptList(scriptsJson.scripts);
    })();
  })

  //remove video and script
  logo.addEventListener('click', function(){
    changeTags("delete"); 
    chrome.storage.local.clear();
    removeScriptList();
  })

  //choose 'submit' or 'onChange'
  //do not need to submit because there's the script in storage
  search_icon.addEventListener('click', function(e){
    e.preventDefault();
    const keyword = search_input.value;

    console.log("what you typed : ", keyword);

    //call the data from session storage
    chrome.storage.local.get(['videoScript'], function(result){
      const scriptArray = result.videoScript.scripts;

      (async() => {  
        //check keyword value
        //and make a new array to pass for makeScriptList function's parameter
        let newScriptArray = [];
        await scriptArray.forEach (el => {
          const time = el.timestamp;
          const script = el.script;
          if(script.indexOf(keyword) != -1){
            newScriptArray.push(
              {
                timestamp: time,
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
  const video = document.getElementById("video");
  const blankVideo = document.getElementById("blankVideo");

  if(state === "create"){
    let srcEmbed = `https://youtube.com/embed/${videoID}`;

    blankVideo.style.display = "none";
    video.style.display = "inline";
    video.setAttribute('src', srcEmbed);
  }
  else{
    blankVideo.style.display = "block";
    video.style.display = "none";
    video.removeAttribute('src');
  }
}

//fetch script json data
const getScriptData = async(videoLink) => {
  const response = await fetch(url + '/link', {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({link: videoLink})
  });
  const content = await response.json();
  return content;
}

//make script lists by json data
const makeScriptList = (data) => {
  removeScriptList();
  console.log("data", data);
  if(data === null) return new Error("There is no script!");
  let ul = document.getElementById("keywordLists");

  data.forEach( el => {
    let li = document.createElement("li");
    let timestamp = document.createElement("div");
    let keyword = document.createElement("div");
    timestamp.appendChild(document.createTextNode(el.timestamp));
    timestamp.setAttribute("class", "timestamp");
    keyword.appendChild(document.createTextNode(el.script));
    keyword.setAttribute("class", "keyword");

    timestamp.addEventListener("click", () => {
      onTimeStampClickHandler(el.timestamp);
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