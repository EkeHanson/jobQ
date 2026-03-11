import apiClient from './api'

const contactService = {
  sendMessage: async ({ name, email, subject, message }) => {
    return apiClient.post('/contact/', {
      name,
      email,
      subject,
      message,
    })
  },
}

export default contactService
