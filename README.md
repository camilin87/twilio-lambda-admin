# twilio-lambda-admin  
Twilio lambda backend to automate other lambda projects

## Configuration  
- Deploy the project  
- Create a twilio number and point it to the lambda  
- Add `PHONE_0`, `PHONE_1`... etc environment variables for the numbers allowed to invoke the function. Numbers should be saved in the form `+130530512345`.  

## Usage  

All actions occur through text messages.  
The application will only accept commands from a predefined list of whitelisted numbers.  

### Change the concurrency level of a lambda  

`LAMBDA CONCURRENCY Lambda1 10`

### Change the value of an environment variable  

`LAMBDA ENV Lambda1 KEY VALUE`

### Disable Lambda event source  

`LAMBDA DISABLE Lambda1`

### Enable Lambda event source  

`LAMBDA ENABLE Lambda1`
