/*
This file is used to get all expenses list from dynamo db table for the user who is logged in.
*/

const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../../lib/dynamoDB");
const { sendHTTPResponse } = require("../../lib/api");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const { getSecretKey } = require("../../lib/secretManager");

const handler = async (event) => {
    try {
        const token = event.headers.authorization.split('Bearer ')[1];

        // get SECRET_KEY from AWS Secrets Manager

        const JWT_SECRET = await getSecretKey();

        console.log("JWT_SECRET: ");
        console.log(JWT_SECRET);

        try {
            jwt.verify(token, JWT_SECRET);
        }
        catch (error) {
            return sendHTTPResponse(401, { error: "Unauthorized user" });
        }

        const decodedToken = jwt.decode(token);

        // Get all expenses for the user using Scan Command
        const scanExpensesCommand = new ScanCommand({
            TableName: "expenses",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": decodedToken.id
            }
        });

        const expenses = await dynamoDocClient.send(scanExpensesCommand);

        return sendHTTPResponse(200, { message: "Expenses fetched successfully", expenses: expenses.Items });

    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during expense fetch." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };