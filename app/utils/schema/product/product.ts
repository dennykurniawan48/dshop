import * as Yup from 'yup'

const productSchema = Yup.object({
    productname: Yup.string().required(),
    price: Yup.number().required().min(0),
    category: Yup.string().required(),
    stock: Yup.number().integer().min(0).required(),
    image1: Yup.string().url().required(),
    image2: Yup.string().url().required(),
    image3: Yup.string().url().required(),
    image4: Yup.string().url().required(),
    desc: Yup.string().required(),
  })

  export default productSchema