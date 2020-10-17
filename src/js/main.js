var buttons = document.getElementsByClassName('button')

Array.prototype.forEach.call(buttons, function (button) {
  button.addEventListener('click', function (event) {
    button.classList.toggle('active')
  })
})