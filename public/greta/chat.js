const inputField = document.querySelector(".message-form-input")
const messageForm = document.querySelector(".message-form")
const messageBox = document.querySelector(".messages-history")
const nickInputField = document.querySelector(".nick-form-input")
const nickForm = document.querySelector(".nick-form")

let userName = ""

const addNewMessage = ({ user, message }) => {
  const time = new Date()
  const formattedTime = time.toLocaleString("en-GB", { hour: "numeric", minute: "numeric" })

  const receivedMsg = `
  <div class="incoming-message">
    <div class="received-message">
      <div class="message-box">${message}</div>
      <div class="message-info">
        <span class="message-author">${user}</span>
        <span class="time-date">${formattedTime}</span>
      </div>
    </div>
  </div>`

  const myMsg = `
  <div class="outgoing-message">
    <div class="sent-message">
      <div class="message-box">${message}</div>
      <div class="message-info">
        <span class="message-author">${userName}</span>  
        <span class="time-date">${formattedTime}</span>
      </div>
    </div>
  </div>`

  messageBox.innerHTML += user === userName ? myMsg : receivedMsg
}

nickForm.addEventListener("submit", (e) => {
  e.preventDefault()
  if (!nickInputField.value) {
    return
  }
  userName = nickInputField.value
  nickForm.style.display = 'none'
  messageForm.style.display = 'block'
  inputField.focus()
})

messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  if (!inputField.value) {
    return
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName
  })

  inputField.value = ""
})


socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
})