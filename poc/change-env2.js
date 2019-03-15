const lambda = require('aws-automation-utils').lambda;

const functionName = 'FUNCTION_NAME';

const main = async () => {
    try {
        console.log('Reading environment');

        const statusUpdateResult = await lambda.updateEnvironment({
            region: 'us-east-2',
            functionName: functionName,
            key: 'TEST',
            value: 'MAYBE'
        });
        console.log('Update Environment Result', statusUpdateResult);

        console.log('Ending...');
        process.exit(0)
    } catch(err){
        console.log('ERROR', err);
        process.exit(1)
    }
};

main();