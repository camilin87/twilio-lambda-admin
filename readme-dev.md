# Development  

## Docs  

https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html

## Deployment to Development  

Prerequisites: Set the environment variables for the twilio credentials  

```bash
 export TWILIO_ACCOUNT_SID="secret1"
 export TWILIO_AUTH_TOKEN="secret2"
 echo "TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}; TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}"
```

Execute the deployment:  

```bash
sls deploy --twilioAccountSid=${TWILIO_ACCOUNT_SID} --twilioAuthToken=${TWILIO_AUTH_TOKEN}
```