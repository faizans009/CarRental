const swaggerAutogen = require('swagger-autogen');
const doc = {
    info: {
        title:"The Pet Store Backend",
        description:"This is The Pet Store"
    },
    host:"https://car-rental-six-sooty.vercel.app/",
    schemes:['http','https']
}
const outputFile = './swagger-output.json'
const endPonintFiles = ['./index.js']
swaggerAutogen(outputFile,endPonintFiles,doc).then(()=>{
    require('./index.js')
})