const API_URL = 'https://crudcrud.com/api/291aca8f61554110b6279ba8c84fc202/unicorns'

class UnicornService {
  async getUnicorns() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching unicorns:', error)
      throw error
    }
  }

  async getUnicorn(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching unicorn with ID ${id}:`, error)
      throw error
    }
  }

  async createUnicorn(unicorn) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unicorn)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating unicorn:', error)
      throw error
    }
  }

  async updateUnicorn(id, unicorn) {
    // The API doesn't accept _id in the request body
    const { _id, ...unicornData } = unicorn
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unicornData)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return true
    } catch (error) {
      console.error(`Error updating unicorn with ID ${id}:`, error)
      throw error
    }
  }

  async deleteUnicorn(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return true
    } catch (error) {
      console.error(`Error deleting unicorn with ID ${id}:`, error)
      throw error
    }
  }
}

export default new UnicornService()

