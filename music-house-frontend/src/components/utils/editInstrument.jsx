export const characteristicsToFormData = (instrument) => {
  const characteristics = {
    idCharacteristics: instrument.data?.characteristics?.idCharacteristics,
    instrumentCase:
      instrument.data?.characteristics?.instrumentCase === 'si' ? true : false,
    support: instrument.data?.characteristics?.support === 'si' ? true : false,
    tuner: instrument.data?.characteristics?.tuner === 'si' ? true : false,
    microphone:
      instrument.data?.characteristics?.microphone === 'si' ? true : false,
    phoneHolder:
      instrument.data?.characteristics?.phoneHolder === 'si' ? true : false
  }

  return characteristics
}

export const formDataToCharacteristics = (formData) => {
  const characteristics = {
    idCharacteristics: formData?.characteristics?.idCharacteristics,
    instrumentCase: formData?.characteristics?.instrumentCase ? 'si' : 'no',
    support: formData?.characteristics?.support ? 'si' : 'no',
    tuner: formData?.characteristics?.tuner ? 'si' : 'no',
    microphone: formData?.characteristics?.microphone ? 'si' : 'no',
    phoneHolder: formData?.characteristics?.phoneHolder ? 'si' : 'no'
  }

  return characteristics
}
