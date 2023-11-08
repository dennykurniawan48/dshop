import * as Yup from 'yup'

export const categorySchema = Yup.object({
    name: Yup.string().required(),
    thumbnail: Yup.string().url().required()
})