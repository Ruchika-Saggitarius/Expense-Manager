const aws = require("aws-sdk");

const handler = async (event) => {
    const { Records } = event;

    for (const record of Records) {
        console.log(record);
        const body = JSON.parse(record.body);
        const { balance } = JSON.parse(body.Message);

        console.log("balance-----: " + balance);

        const snsClient = new aws.SNS({ region: "us-east-1" });
        try {
            await snsClient.publish(
                {
                    TopicArn: "arn:aws:sns:us-east-1:222756784364:EmailExpenseSNSTopic",
                    Message: "Your balance went negative !! \n" + "Currently your balance in Expense Manager is : " + balance + "\n",
                    Subject: "Expense Manager Balance"
                }
            ).promise();
        }
        catch (err) {
            console.error(err);
        }

    }
}

module.exports = { handler };
