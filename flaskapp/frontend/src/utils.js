export function isValidJwt (jwt) {
  if (!jwt || jwt.split('.').length < 3) {
    return false
  }
  const data = JSON.parse(atob(jwt.split('.')[1]))
  const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
  const now = new Date()
  return now < exp
}

export function checkFields(register, owner_mail, owner_name, passphrase) {
  let empty = false

  if (register && owner_name == "") {
      document.getElementById("name").className = "empty"
      empty = true
  }
  if (owner_mail == "") {
      document.getElementById("mail").className = "empty"
      empty = true
  }
  if (passphrase == "") {
      document.getElementById("passphrase").className = "empty"
      empty = true
  }

  return empty
}
