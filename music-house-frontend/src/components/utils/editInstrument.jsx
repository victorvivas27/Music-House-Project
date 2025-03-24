export const characteristicsToFormData = (instrument) => {
  const characteristics = {
    idCharacteristics: instrument.result?.characteristics?.idCharacteristics,
    instrumentCase:
      instrument.result?.characteristics?.instrumentCase === 'si' ? true : false,
    support: instrument.result?.characteristics?.support === 'si' ? true : false,
    tuner: instrument.result?.characteristics?.tuner === 'si' ? true : false,
    microphone:
      instrument.result?.characteristics?.microphone === 'si' ? true : false,
    phoneHolder:
      instrument.result?.characteristics?.phoneHolder === 'si' ? true : false
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
