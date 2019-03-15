const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
var lambda = new AWS.Lambda();

const functionName = 'FUNCTION_NAME';

const main = async () => {
    try {
        console.log('Reading environment');

        const concurrencyChangeResult = await lambda.putFunctionConcurrency({
            FunctionName: functionName,
            ReservedConcurrentExecutions: 3
        }).promise();
        console.log('Concurrency Change Result', concurrencyChangeResult);

        // const concurrencyRemovalResult = await lambda.deleteFunctionConcurrency({
        //     FunctionName: functionName
        // }).promise();
        // console.log('Concurrency Change Result', concurrencyRemovalResult);

        console.log('Ending...');
        process.exit(0)
    } catch(err){
        console.log('ERROR', err);
        process.exit(1)
    }
};

main();