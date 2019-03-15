const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
var lambda = new AWS.Lambda();

const functionName = 'FUNCTION_NAME';

const main = async () => {
    try {
        console.log('Reading environment');

        const functionConfig = await lambda.getFunctionConfiguration({
            FunctionName: functionName
        }).promise();
        console.log('Current Config', functionConfig);

        // // This works
        // const sourceEnvironmentVariables = functionConfig.Environment;
        // sourceEnvironmentVariables.Variables.PRESET_RESPONSE = '';
        //
        // const configUpdateResult = await lambda.updateFunctionConfiguration({
        //     FunctionName: functionName,
        //     Environment: sourceEnvironmentVariables
        // }).promise();
        // console.log('Update Config', configUpdateResult);

        console.log('Ending...');
        process.exit(0)
    } catch(err){
        console.log('ERROR', err);
        process.exit(1)
    }
};

main();