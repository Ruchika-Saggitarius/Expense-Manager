/*
This file is used to create an expense in dynamo db table for the user who is logged in.
*/

const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../../lib/dynamoDB");
const { sendHTTPResponse } = require("../../lib/api");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const { v4: uuidv4 } = require('uuid');
const { getSecretKey } = require("../../lib/secretManager");
const aws = require("aws-sdk");

const handler = async (event) => {
    try {
        const { category, amount, date, description } = event.body;

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

        const expense = {
            expenseId: uuidv4(),
            category,
            amount,
            date,
            description,
            userId: decodedToken.id
        };

        const storeExpenseCommand = new PutCommand({
            TableName: "expenses",
            Item: expense
        });
        await dynamoDocClient.send(storeExpenseCommand);

        // Get all expenses for the user using Scan Command

        const scanExpensesCommand = new ScanCommand({
            TableName: "expenses",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": decodedToken.id
            }
        });

        const expenses = await dynamoDocClient.send(scanExpensesCommand);

        // Get balance for the user

        let balance = 0;

        expenses.Items.forEach(expense => {
            if (expense.category === "income") {
                balance += expense.amount;
            }
            else {
                balance -= expense.amount;
            }
        });

        if (balance < 0) {

            const snsClient = new aws.SNS({ region: "us-east-1" });

            console.log("balance is negative........" + balance);

            // publish to SNS
            try {
                const resp = await snsClient.publish(
                    {
                        TopicArn: "arn:aws:sns:us-east-1:222756784364:ExpenseSNSTopic",
                        Message: JSON.stringify({ balance: balance }),
                    }
                ).promise();
                console.log(resp);

                return sendHTTPResponse(200, { message: "Expense created successfully", expenses: expenses.Items, balance: balance });

            }
            catch (err) {
                console.error(err);
                return sendHTTPResponse(500, { error: "An error occurred while publishing to SNS" });
            }
        }

        return sendHTTPResponse(200, { message: "Expense created successfully", expenses: expenses.Items, balance: balance });


    }
    catch (error) {
        console.log(error);
        return sendHTTPResponse(500, { error: "An error occurred during expense creation." });
    }
}

// @ts-ignore
module.exports = { handler: middy(handler).use(httpJsonBodyParser()) };
