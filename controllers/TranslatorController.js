const {StatusCodes} = require('http-status-codes');
const axios = require('axios')


const GetTranslation = async (req, res) => {
    const {input, sourceLang, targetLang} = req.body;
    console.log(input, sourceLang, targetLang)
    const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.AUTHKEY}&text=${input}&source_lang=${sourceLang}&target_lang=${targetLang}`
    console.log(deeplUrl)
    const response = await axios.get(deeplUrl)
    const translation = response.data.translations[0].text
    if (!translation) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Could not translate'})
    }
    res.status(StatusCodes.OK).send(translation)

    return data
    
} 



module.exports = {
    GetTranslation
}
