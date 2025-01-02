export const validate = (input) => async(req, res, next) => {
    try {
        if(req.body && Object.keys(req.body).length > 0){
            const parseBody = await input.parseAsync(req.body)
            req.body = parseBody
        }
        if(req.params && Object.keys(req.params).length > 0){
            const parseParams = await input.parseAsync(req.params)
            req.params = parseParams
        }
        next()
    } catch (error) {
        const message = error.errors[0].message
        res.status(400).json({ message: message })
    }
}