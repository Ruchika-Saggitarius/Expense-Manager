/*
This file is used to register a new user in dynamo db table and saved password in hashed format using sha256.
*/

const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../../lib/dynamoDB");
const { sendHTTPResponse } = require("../../lib/api");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const middy = require("@middy/core");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const handler = async (event) => {
    try {
        const { name, email, password } = event.body;

        // Check if user already exists using Scan Command

        const scanUserCommand = new ScanCommand({
            TableName: "users_info",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        });

        const users = await dynamoDocClient.send(scanUserCommand);

        if (users.Items.length > 0) {
            return sendHTTPResponse(400, { error: "User already exists." });
        }


        // Hash the password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword
        };

        const storeUserCommand = new PutCommand({
            TableName: "users_info",
            Item: user
        });
        await dynamoDocClient.send(storeUserCommand);

        return sendHTTPResponse(200, { message: "User registered successfully" });

    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during user registration." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };
