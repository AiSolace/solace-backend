const chat=document.getElementById("chat-messages")
const input=document.getElementById("chat-input")
const send=document.getElementById("chat-send")

let session=Math.random().toString(36).substring(7)

function addMessage(text,sender){

const msg=document.createElement("div")

msg.className=sender==="user"?"user-message":"bot-message"

msg.innerText=text

chat.appendChild(msg)

chat.scrollTop=chat.scrollHeight

}

async function sendToServer(message){

  addMessage(message,"user")

  try{
    const res = await fetch("/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:message,
        session:session
      })
    })

    const data = await res.json()

    addMessage(data.reply,"bot")

  }catch(err){
    addMessage("Error connecting to server","bot")
  }

}

send.onclick=()=>{

if(input.value.trim()){

sendToServer(input.value)

input.value=""

}

}

input.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){
send.onclick()
}

})
