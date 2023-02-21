import Joi from "@hapi/joi";


export const registerSchema = Joi.object({
    username : Joi.string().min(5).required(),
    email : Joi.string().min(6).required().email({tlds : {allow : false}}),
    password : Joi.string().min(6).required(),
})

export const emailSchema = Joi.object({
    email : Joi.string().min(6).required().email({tlds : {allow : false}}).label("Email"),
})

export const passwordSchema = Joi.object({
    password : Joi.string().min(6).required().label("Password")
})

export const usernameSchema = Joi.object({
    username : Joi.string().min(5).required().label("Username")
})

export const initialValidationState = {
    error: false,
    helper: "",
  };

export const onRefChange = (varRef, schema, key, setFeedback, feedback) => {
    let obj = {};
    obj[key] = varRef.current.value;
    const {error} = schema.validate(obj)
    if(error){
      setFeedback({error : true, helper : error.message})
    }
    else if(feedback.error){
      setFeedback(initialValidationState);
    }
  }