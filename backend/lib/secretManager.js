/*
This file is created to retrieve secret key from AWS Secrets Manager.
*/

const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const getSecretKey = async () => {

    const secretsManagerClient = new SecretsManagerClient({ region: "us-east-1" });

    const getSecretValueCommand = new GetSecretValueCommand({
        SecretId : "EXPENSE_MANAGER_SECRET"
        });

        const secretValue = await secretsManagerClient.send(getSecretValueCommand);

        const JWT_SECRET = JSON.parse(secretValue.SecretString).JWT_SECRET;

        return JWT_SECRET;
}

module.exports = {
    getSecretKey
};
