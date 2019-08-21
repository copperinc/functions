let aws = require('aws-sdk')

/**
 * reads ws urls generated by cfn from ssm
 */
// TODO eventually consolidate reflection lookups into src/utils
module.exports = function lookupWebsocketEndpoints(callback) {
  let ssm = new aws.SSM
  let Path = `/${process.env.ARC_CLOUDFORMATION}`
  ssm.getParametersByPath({Path, Recursive:true}, function done(err, result) {
    if (err) callback(err)
    else {
      let topic = param=> param.Name.split('/')[2] === 'ws'
      let wss = result.Parameters.filter(topic).reduce((a, b)=> {
        a[b.Name.split('/')[3]] = b.Value
        return a
      }, {})
      callback(null, wss)
    }
  })
}
