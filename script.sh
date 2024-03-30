ZIP_FILE_NAME=lambdas.zip
BUCKET_NAME=b00885185lambdas
CLOUD_FORMATION_FILE=cf.json
SERVICE_NAME=csci-5409
FRONTEND_BUCKET_NAME=ruchika-b00885185-termassignment-frontend
S3KEY=expensemanager.zip
aws s3 mb s3://$FRONTEND_BUCKET_NAME
cd frontend
npm run build
rm -rf node_modules
rm .env
zip -r $S3KEY ./
aws s3 cp $S3KEY s3://$FRONTEND_BUCKET_NAME
cd ..
cd backend
zip -r $ZIP_FILE_NAME ./
aws s3 mb s3://$BUCKET_NAME
aws s3 cp $ZIP_FILE_NAME  s3://$BUCKET_NAME
aws s3 cp $CLOUD_FORMATION_FILE  s3://$BUCKET_NAME
aws cloudformation validate-template --template-url https://$BUCKET_NAME.s3.amazonaws.com/$CLOUD_FORMATION_FILE
aws cloudformation create-stack --stack-name $SERVICE_NAME --template-url https://$BUCKET_NAME.s3.amazonaws.com/$CLOUD_FORMATION_FILE --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name $SERVICE_NAME