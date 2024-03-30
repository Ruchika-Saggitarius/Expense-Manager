/*
This file is used to reset a user's password by taking its email and new password in request body.
*/

const { UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../../lib/dynamoDB");
const { sendHTTPResponse } = require("../../lib/api");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const middy = require("@middy/core");
const crypto = require('crypto');

const handler = async (event) => {
    try {
        const { email, newPassword } = event.body;

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

        // get user id

        const id = users.Items[0].id;

        // Hash the password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        const updateUserCommand = new UpdateCommand({
            TableName: "users_info",
            Key: {
                id
            },
            UpdateExpression: "set password = :password",
            ExpressionAttributeValues: {
                ":password": hashedPassword
            }
        });

        await dynamoDocClient.send(updateUserCommand);

        return sendHTTPResponse(200, { message: "Password updated successfully" });

    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during password reset." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };