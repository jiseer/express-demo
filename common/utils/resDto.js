function success(data = null, code = 200) {
  return {
    data,
    code,
    message: 'ok'
  }
}

function error(message = 'error', code = 500) {
  return {
    code,
    message
  }
}


const resDto = {
  success,
  error,
}

module.exports = resDto;