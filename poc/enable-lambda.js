const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
var lambda = new AWS.Lambda();

const functionName = 'FUNCTION_NAME';

const main = async () => {
    try {
        console.log('Reading environment');

        const evenSourceListResult = await lambda.listEventSourceMappings({
            FunctionName: functionName,
        }).promise();
        console.log('List Event Source Result', evenSourceListResult);

        let mappingIds = evenSourceListResult.EventSourceMappings.map(m => m.UUID);
        console.log('Mappings', mappingIds);

        for (var i = 0; i < mappingIds.length; i++) {
            const uuid = mappingIds[i];

            const updateResult = await lambda.updateEventSourceMapping({
                FunctionName: functionName,
                UUID: uuid,
                Enabled: true
            }).promise();
            console.log(`Update Completed uuid: ${uuid}; result:`, updateResult);
        }

        console.log('Ending...');
        process.exit(0)
    } catch(err){
        console.log('ERROR', err);
        process.exit(1)
    }
};

main();