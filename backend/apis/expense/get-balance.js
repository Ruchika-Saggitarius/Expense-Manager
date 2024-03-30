/*
This file is to calculate balance of the logged in user by fetching all of its expenses from dynamo db table and 
doing calculation based upon category whether income or expense
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

        let balance = 0;

        expenses.Items.forEach(expense => {
            if (expense.category === "income") {
                balance = balance + expense.amount;
            }
            else {
                balance = balance - expense.amount;
            }
            console.log("******************");
            console.log(balance);
            console.log("******************");
        });

        return sendHTTPResponse(200, { balance });

    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during balance calculation." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };
