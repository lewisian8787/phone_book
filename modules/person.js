const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// specifiying shape of object
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // 1. Must contain exactly one dash
        const parts = value.split('-')
        if (parts.length !== 2) return false

        const [left, right] = parts

        // 2. Left side must be 2–3 digits
        if (left.length < 2 || left.length > 3) return false
        if (!left.split('').every(char => char >= '0' && char <= '9')) return false

        // 3. Right side must be 6–10 digits
        if (right.length < 6 || right.length > 10) return false
        if (!right.split('').every(char => char >= '0' && char <= '9')) return false

        return true
      },
      message: (props) =>
        `${props.value} is not a valid phone number (format: 09-123456 or 040-1234567)`
    }
  }
})

// formatting the id and __v properties
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)