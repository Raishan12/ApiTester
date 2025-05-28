import userSchema from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password } = req.body


    if (!(name && email && password))
      return res.status(400).send("Incorrect email or password!")

    const userExist = await userSchema.findOne({ email })
    if (userExist)
      return res.status(400).send("User already exist")
    
    bcrypt.hash(password, 10).then(async (hashedpwd) => {
      console.log(hashedpwd)
      const data = await userSchema.create({ name, email, password: hashedpwd })
      const token = await jwt.sign({ id: data._id }, process.env.JWT_KEY, { expiresIn: "20h" })
      console.log(token)
      res.status(201).send({data,token})
  })

  } catch (error) {
    res.status(500).send({ message: "Failed to save data!", error })
  }
}

export const autsignup = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email } = req.body

    const userExist = await userSchema.findOne({ email })

    if (userExist) {
      if (userExist.auth0) {
        return res.status(200).send({ message: "User loggedIn", data })
      }
    }

    const data = await userSchema.create({ name, email })
    res.status(201).send({ message: "User LoggedIn", data })

  } catch (error) {
    res.status(500).send({ message: "failed to signup", error })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const userExist = await userSchema.findOne({ email })
    
    if (!userExist) {
      return res.status(400).json({ message: "User not Found" })
    }
    console.log(userExist)
    
    const isPasswordMatch = await bcrypt.compare(password, userExist.password)
    
    console.log(isPasswordMatch)
    
    if (!isPasswordMatch) {
      return res.status(402).json({ message: "Incorrect Password" })
    }
    
    const token = await jwt.sign({ id: userExist._id }, process.env.JWT_KEY, { expiresIn: "20h" })

    return res.status(200).json({ message: "User successfully Logged", token, user_id: userExist._id })

  } catch (error) {
    res.status(500).send("failed to fetch data!")
  }
}

export const getuser = async(req, res)=> {
  try {
    const { id } = req.params
    // console.log(id)
    const data = await userSchema.findById(id)
    console.log(data)
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send("Failed to fetch data!")
  }
}