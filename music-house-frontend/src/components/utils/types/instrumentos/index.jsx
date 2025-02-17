import { number, string } from "yup";

const InstrumentResponseData = {
  idInstrument: number,
  registDate: Boolean,
  name: string,
  description: string,
  measures: string,
  weight: number,
  rentalPrice: number,
  category: {
    idCategory: number,
    registDate: string,
    categoryName: string,
    description: string
  },
  theme: {
    idTheme: 1,
    registDate: string,
    themeName: string,
    description: string
  },
  imageUrls: [
    {
      idImage: number,
      registDate: string,
      imageUrl: string
    }
  ]
}

export default InstrumentResponseData