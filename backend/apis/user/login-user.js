/*
This file is used to login a user by verifying email and password from dynamo db table and create jwt token to maintain a session.
*/

const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../../lib/dynamoDB");
const { sendHTTPResponse } = require("../../lib/api");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const middy = require("@middy/core");
const jwt = require('jsonwebtoken');
const { getSecretKey } = require("../../lib/secretManager");
const crypto = require('crypto');


const handler = async (event) => {
    try {
        const { email, password } = event.body;

        // get SECRET_KEY from AWS Secrets Manager

        const JWT_SECRET = await getSecretKey();

        console.log("JWT_SECRET: ");
        console.log(JWT_SECRET);

        // Check if user already exists using Scan Command

        const scanUserCommand = new ScanCommand({
            TableName: "users_info",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        });

        const users = await dynamoDocClient.send(scanUserCommand);

        if (users.Items.length === 0) {
            return sendHTTPResponse(400, { error: "User does not exist." });
        }

        const user = users.Items[0];

        // Hash the provided password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Compare the hashed provided password with the stored hashed password
        if (hashedPassword !== user.password) {
                    return sendHTTPResponse(400, { error: "Invalid password." });
        }

        // generate jwt token

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET);

        return sendHTTPResponse(200, { message: "User logged in successfully", token });

    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during user login." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };