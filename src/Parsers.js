module.exports ={
    // TODO: this needs some error handling in case a parser is not defined for a specific type
    trackReaders: {
        'bvh': require('./BVHReader.js')
    }            
};