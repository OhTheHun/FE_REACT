export async function loginWithCredentials({ email, password }) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (email.includes('@') && password.length >= 6) {
        resolve({ id: 'user-1', name: 'JotDown User', email })
      } else {
        reject(new Error('Email hoặc mật khẩu không hợp lệ.'))
      }
    }, 400)
  })
}

export async function logoutUser() {
  return Promise.resolve()
}
